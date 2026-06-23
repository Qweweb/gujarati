package in.gujaratiapp;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    // Channel ID — must match the one we declare in AndroidManifest meta-data
    private static final String CHANNEL_ID = "gujarati_app_channel";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        createNotificationChannel();
    }

    private void createNotificationChannel() {
        // Notification Channels are required on Android 8.0+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

            // Build the URI pointing to res/raw/notification_sound.mp3
            Uri soundUri = Uri.parse(
                "android.resource://" + getPackageName() + "/" + R.raw.notification_sound
            );

            // Audio attributes for notification category
            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .build();

            // Create the channel
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Gujarati App Notifications",          // visible channel name
                NotificationManager.IMPORTANCE_HIGH    // HIGH = sound + heads-up
            );
            channel.setDescription("ગુજરાતી એપ ની સૂચનાઓ");
            channel.setSound(soundUri, audioAttributes);
            channel.enableVibration(true);

            // Register the channel with the system
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
}
