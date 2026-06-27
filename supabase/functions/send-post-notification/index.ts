import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { GoogleAuth } from "npm:google-auth-library@9.6.0";

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: {
    id: string;
    content: string;
    media_urls?: string[];
    post_type: string;
    created_at: string;
  };
  old_record: any;
}

serve(async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let notifyTitle = 'ગુજરાતી એપ';
    let notifyText = '';
    let imageUrl = null;

    const payload: any = await req.json();
    console.log("Received payload:", JSON.stringify(payload));

    if (payload.is_custom) {
      notifyTitle = payload.title || 'ગુજરાતી એપ';
      notifyText = payload.body || '';
      imageUrl = payload.image_url || null;
    } else {
      // We only send notifications for new inserts in the posts table
      if (payload.type !== 'INSERT' || payload.table !== 'posts') {
        return new Response(JSON.stringify({ message: 'Trigger ignored. Not a post insert.' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const record = payload.record;
      notifyText = record.content || '';
      
      // Parse poll questions if it's a poll
      if (notifyText.startsWith('POLL::')) {
        try {
          const pollData = JSON.parse(notifyText.substring(6));
          notifyText = `પોલ: ${pollData.question || 'તમારો મત આપો'}`;
        } catch {
          notifyText = 'નવો પોલ: તમારો મત આપો';
        }
      }

      // Truncate notification body if it's too long
      if (notifyText.length > 150) {
        notifyText = notifyText.substring(0, 147) + '...';
      }

      // Get the first image URL if any
      imageUrl = record.media_urls?.[0] || null;
    }

    // Load Firebase Service Account key from Supabase secrets
    const serviceAccountJson = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
    if (!serviceAccountJson) {
      console.error("FIREBASE_SERVICE_ACCOUNT secret is not configured in Supabase");
      return new Response(JSON.stringify({ error: 'Firebase credentials missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const serviceAccount = JSON.parse(serviceAccountJson);

    // Authenticate with Google
    const auth = new GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const accessToken = tokenResponse.token;

    if (!accessToken) {
      throw new Error("Failed to retrieve Google OAuth2 access token");
    }

    // Construct the FCM request payload
    const fcmMessage = {
      message: {
        topic: 'all_users',
        notification: {
          title: notifyTitle,
          body: notifyText,
          ...(imageUrl && { image: imageUrl })
        },
        android: {
          notification: {
            sound: 'default',
            clickAction: 'FCM_OUTDOOR_ACTIVITY',
            ...(imageUrl && { image: imageUrl })
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              'mutable-content': 1
            }
          },
          fcm_options: {
            ...(imageUrl && { image: imageUrl })
          }
        }
      }
    };

    console.log("Sending message to FCM topic 'all_users':", JSON.stringify(fcmMessage));

    // Send HTTP post request to FCM v1 API
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;
    const fcmResponse = await fetch(fcmUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fcmMessage),
    });

    const fcmResult = await fcmResponse.json();
    console.log("FCM Response status:", fcmResponse.status, JSON.stringify(fcmResult));

    if (!fcmResponse.ok) {
      throw new Error(`FCM API responded with error code ${fcmResponse.status}`);
    }

    return new Response(JSON.stringify({ success: true, messageId: fcmResult.name }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Webhook function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
