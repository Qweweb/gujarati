import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { PUZZLES } from '../data/dailyPuzzles';
import { supabase } from '../supabaseClient';

// Helper to calculate the day of the year (1-366)
const getDayOfYear = (date = new Date()) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

// Helper to scramble characters of a puzzle word
export const getScrambledCharacters = (puzzle) => {
  if (!puzzle || !puzzle.characters) return '';
  let shuffled = [...puzzle.characters];
  let attempts = 0;
  while (shuffled.join('') === puzzle.word && attempts < 10) {
    shuffled.sort(() => Math.random() - 0.5);
    attempts++;
  }
  return shuffled.join(' | ');
};

// 7 Quirky Gujarati Notification Templates for Day of Week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
const DAY_TEMPLATES = [
  // 0: Sunday (રવિવાર)
  {
    title: (streak) => `👑 રવિવાર મેગા ધમાકા ક્વિઝ! 💥`,
    body: (scrambled, hintSnippet, streak) =>
      `આજનો રોયલ શબ્દ: '${scrambled}' 🏙️ ${hintSnippet ? `💡 ${hintSnippet}` : ''} 🏆 આજની પઝલ પૂરી કરીને લીડરબોર્ડ પર રાજ કરો! 🎁`
  },
  // 1: Monday (સોમવાર)
  {
    title: (streak) => `🧠 સોમવાર મગજ કસો! આજનો વર્ડ સ્ક્રૅમ્બલ 🧩`,
    body: (scrambled, hintSnippet, streak) =>
      `આડાઅવળા અક્ષરો: '${scrambled}' 🧐 ${hintSnippet ? `💡 ${hintSnippet}` : ''} સાચો શબ્દ બનાવો અને તમારી સ્ટ્રીક જાળવો! 🚀`
  },
  // 2: Tuesday (મંગળવાર)
  {
    title: (streak) => `🔥 મંગળવાર સ્પેશિયલ! (🔥 ${streak || 1} દિવસની સ્ટ્રીક બચાવો)`,
    body: (scrambled, hintSnippet, streak) =>
      `અક્ષરો સીધા ગોઠવો: '${scrambled}' 🏙️ ${hintSnippet ? `💡 ${hintSnippet}` : ''} 🎯 હમણાં જ રમીને તમારી સ્ટ્રીક વધારો!`
  },
  // 3: Wednesday (બુધવાર)
  {
    title: (streak) => `🧩 બુધવાર કૂટપ્રશ્ન! 99% લોકો ભૂલ કરે છે 🧐`,
    body: (scrambled, hintSnippet, streak) =>
      `શું તમે આ અક્ષરો ઉકેલી શકશો: '${scrambled}'? ${hintSnippet ? `💡 ${hintSnippet}` : ''} 🏆 ટેપ કરીને સાચો જવાબ આપો!`
  },
  // 4: Thursday (ગુરુવાર)
  {
    title: (streak) => `⚡ ગુરુવાર પઝલ ટાઇમ! આજનો સિક્રેટ શબ્દ 🔮`,
    body: (scrambled, hintSnippet, streak) =>
      `અક્ષરો આડાઅવળા થઈ ગયા છે: '${scrambled}' 🛕 ${hintSnippet ? `💡 ${hintSnippet}` : ''} 🚩 ટેપ કરો અને આજનો કૂટપ્રશ્ન સોલ્વ કરો!`
  },
  // 5: Friday (શુક્રવાર)
  {
    title: (streak) => `🎉 શુક્રવાર સુપર સ્ક્રૅમ્બલ! વીકેન્ડ મૂડ ઓન 🥳`,
    body: (scrambled, hintSnippet, streak) =>
      `અક્ષરો ઓળખી બતાવો: '${scrambled}' 🚩 ${hintSnippet ? `💡 ${hintSnippet}` : ''} 👑 રમવા માટે અહીં ક્લિક કરો અને પોઈન્ટ્સ મેળવો!`
  },
  // 6: Saturday (શનિવાર)
  {
    title: (streak) => `🌟 શનિવાર વીકેન્ડ ચેલેન્જ! ⚔️`,
    body: (scrambled, hintSnippet, streak) =>
      `મગજ દોડાવો: '${scrambled}' ⛰️ ${hintSnippet ? `💡 ${hintSnippet}` : ''} 🧐 શું તમે પહેલી જ ટ્રાયમાં સાચો જવાબ આપી શકશો?`
  }
];

/**
 * Record a Notification Click Event to Supabase and LocalStorage
 */
export const recordNotificationClick = async (extraData = {}) => {
  try {
    const userId = localStorage.getItem('supabase_user_id') || 'guest';
    const userName = localStorage.getItem('google_name') || localStorage.getItem('user_name') || 'અજ્ઞાત યુઝર';
    const userPhone = localStorage.getItem('user_phone') || localStorage.getItem('supabase_user_mobile') || '';
    
    const clickRecord = {
      user_id: userId,
      user_name: userName,
      user_phone: userPhone,
      click_type: 'daily_quiz',
      puzzle_word: extraData.word || extraData.puzzle_word || 'Daily Quiz',
      device_info: Capacitor.isNativePlatform() ? 'Android App' : 'Web Browser',
      created_at: new Date().toISOString()
    };

    // 1. Try pushing to Supabase table
    try {
      await supabase.from('notification_clicks').insert([clickRecord]);
    } catch (e) {
      console.warn('Could not save click to Supabase table notification_clicks:', e);
    }

    // 2. Save locally for Admin dashboard
    const existingClicks = JSON.parse(localStorage.getItem('admin_notification_clicks') || '[]');
    existingClicks.unshift(clickRecord);
    if (existingClicks.length > 300) existingClicks.pop();
    localStorage.setItem('admin_notification_clicks', JSON.stringify(existingClicks));

    window.dispatchEvent(new CustomEvent('notification-click-recorded', { detail: clickRecord }));
    console.log('Recorded notification click:', clickRecord);
  } catch (err) {
    console.error('Failed to record notification click:', err);
  }
};

/**
 * Schedule daily Notifications for the next 7 days at Admin-configured time
 */
export const scheduleDailyQuizNotifications = async () => {
  try {
    if (!Capacitor.isNativePlatform()) {
      console.log('Quiz notifications: Native platform required for background scheduling.');
      return false;
    }

    // Check admin setting preference
    const enabled = localStorage.getItem('admin_offline_quiz_enabled');
    if (enabled === 'false') {
      await cancelQuizNotifications();
      return false;
    }

    // 1. Request permissions if not granted
    let perm = await LocalNotifications.checkPermissions();
    if (perm.display !== 'granted') {
      perm = await LocalNotifications.requestPermissions();
    }
    if (perm.display !== 'granted') {
      console.log('Quiz notifications permission denied.');
      return false;
    }

    // Read Admin configured notification time (default 09:00)
    const notifTimeStr = localStorage.getItem('admin_offline_quiz_time') || '09:00';
    const [targetHour, targetMinute] = notifTimeStr.split(':').map((n) => parseInt(n, 10) || 0);

    // 2. Prepare notifications for the next 7 days
    const notificationsToSchedule = [];
    const now = new Date();
    const savedStreak = parseInt(localStorage.getItem('otlo_challenge_streak') || '0', 10);

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() + dayOffset);
      targetDate.setHours(targetHour, targetMinute, 0, 0);

      // If target time has already passed today, schedule for next week's same day
      if (dayOffset === 0 && now.getTime() >= targetDate.getTime()) {
        targetDate.setDate(targetDate.getDate() + 7);
      }

      // Calculate puzzle for that specific target date
      const dayOfYear = getDayOfYear(targetDate);
      const puzzleIndex = (dayOfYear - 1) % PUZZLES.length;
      const puzzle = PUZZLES[puzzleIndex];

      const scrambled = getScrambledCharacters(puzzle);
      const dayOfWeek = targetDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const template = DAY_TEMPLATES[dayOfWeek];

      // Trim hint snippet if long
      let hintSnippet = puzzle.hint || '';
      if (hintSnippet.length > 50) {
        hintSnippet = hintSnippet.substring(0, 47) + '...';
      }

      const notifId = 9000 + dayOfWeek; // Fixed IDs 9000..9006 for 7 days

      notificationsToSchedule.push({
        id: notifId,
        title: template.title(savedStreak),
        body: template.body(scrambled, hintSnippet, savedStreak),
        schedule: {
          at: targetDate,
          repeats: true,
          every: 'week'
        },
        extra: {
          route: '/daily-challenge',
          type: 'daily_quiz_reminder',
          word: puzzle.word
        },
        actionTypeId: 'OPEN_QUIZ',
        smallIcon: 'ic_stat_name',
        iconColor: '#EAB308',
        sound: 'notification_sound.mp3'
      });
    }

    // 3. Cancel previous quiz notifications & schedule fresh ones
    await cancelQuizNotifications();
    await LocalNotifications.schedule({ notifications: notificationsToSchedule });

    console.log(`Successfully scheduled 7 quirky quiz notifications at ${notifTimeStr}!`);
    return true;
  } catch (error) {
    console.error('Error scheduling quiz notifications:', error);
    return false;
  }
};

/**
 * Cancel existing daily quiz notifications
 */
export const cancelQuizNotifications = async () => {
  try {
    if (!Capacitor.isNativePlatform()) return;
    const pending = await LocalNotifications.getPending();
    const quizNotifIds = pending.notifications
      .filter((n) => n.id >= 9000 && n.id <= 9006)
      .map((n) => ({ id: n.id }));

    if (quizNotifIds.length > 0) {
      await LocalNotifications.cancel({ notifications: quizNotifIds });
    }
  } catch (e) {
    console.warn('Error cancelling quiz notifications:', e);
  }
};

/**
 * Send an immediate test notification (fires in 5 seconds)
 */
export const sendTestQuizNotification = async () => {
  try {
    const isNative = Capacitor.isNativePlatform();
    
    // Select today's puzzle
    const dayOfYear = getDayOfYear(new Date());
    const puzzleIndex = (dayOfYear - 1) % PUZZLES.length;
    const puzzle = PUZZLES[puzzleIndex];
    const scrambled = getScrambledCharacters(puzzle);
    const dayOfWeek = new Date().getDay();
    const template = DAY_TEMPLATES[dayOfWeek];
    const savedStreak = parseInt(localStorage.getItem('otlo_challenge_streak') || '0', 10);

    let hintSnippet = puzzle.hint || '';
    if (hintSnippet.length > 50) {
      hintSnippet = hintSnippet.substring(0, 47) + '...';
    }

    const title = template.title(savedStreak);
    const body = template.body(scrambled, hintSnippet, savedStreak);

    if (isNative) {
      let perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') {
        perm = await LocalNotifications.requestPermissions();
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 9999,
            title: `[TEST 5s] ${title}`,
            body: body,
            schedule: { at: new Date(Date.now() + 5000) }, // 5 seconds from now
            extra: {
              route: '/daily-challenge',
              type: 'daily_quiz_reminder',
              word: puzzle.word
            },
            smallIcon: 'ic_stat_name',
            iconColor: '#EAB308',
            sound: 'notification_sound.mp3'
          }
        ]
      });
      return { success: true, mode: 'native', title, body };
    } else {
      // Browser fallback (Web notification + In-app pop-up preview)
      let permissionGranted = false;

      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          permissionGranted = true;
        } else if (Notification.permission !== 'denied') {
          const res = await Notification.requestPermission();
          if (res === 'granted') permissionGranted = true;
        }
      }

      setTimeout(() => {
        // Play notification tone in browser
        try {
          const audio = new Audio('/notification_sound.mp3');
          audio.play().catch(() => {});
        } catch (e) {}

        // Dispatch in-app preview popup event for instant display
        window.dispatchEvent(
          new CustomEvent('show-notification-preview', {
            detail: { title: `[TEST 5s] ${title}`, body, route: '/daily-challenge', word: puzzle.word }
          })
        );

        if (permissionGranted) {
          try {
            const notif = new Notification(`[TEST 5s] ${title}`, {
              body: body,
              icon: '/logo.jpg'
            });
            notif.onclick = () => {
              recordNotificationClick({ word: puzzle.word });
              window.focus();
              window.location.hash = '#/daily-challenge';
            };
          } catch (e) {
            console.warn('Web notification construct failed (likely Incognito mode):', e);
          }
        }
      }, 5000);

      return { success: true, mode: 'web', title, body };
    }
  } catch (error) {
    console.error('Test notification failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Initialize Deep Linking Listener for Notification Clicks
 */
export const initQuizNotificationListener = (onNavigate) => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    LocalNotifications.addListener('localNotificationActionPerformed', (notificationAction) => {
      console.log('Local Notification Action Performed:', notificationAction);
      const extra = notificationAction.notification.extra;
      if (extra) {
        recordNotificationClick(extra);
        const target = extra.url || extra.route;
        if (target) {
          if (target.startsWith('http://') || target.startsWith('https://')) {
            window.open(target, '_system');
          } else if (typeof onNavigate === 'function') {
            onNavigate(target);
          } else {
            window.location.href = target;
          }
        }
      }
    });
  } catch (e) {
    console.warn('Could not attach LocalNotifications listener:', e);
  }
};

/**
 * Schedule a Custom Offline Notification (with title, body, image, route link, schedule time)
 */
export const scheduleCustomOfflineNotification = async (notifItem) => {
  try {
    const isNative = Capacitor.isNativePlatform();
    const id = notifItem.id || (Math.floor(Math.random() * 80000) + 10000);
    const targetDate = new Date(notifItem.scheduledAt || Date.now() + 10000);

    const savedCustoms = JSON.parse(localStorage.getItem('custom_offline_notifications') || '[]');
    const newCustoms = [notifItem, ...savedCustoms.filter(c => c.id !== notifItem.id)];
    localStorage.setItem('custom_offline_notifications', JSON.stringify(newCustoms));

    try {
      await supabase.from('app_settings').upsert({
        key: 'custom_offline_notifications_list',
        value: JSON.stringify(newCustoms)
      }, { onConflict: 'key' });
    } catch (e) {
      console.warn('Could not sync custom notification list to Supabase:', e);
    }

    if (isNative) {
      let perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') {
        perm = await LocalNotifications.requestPermissions();
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: id,
            title: notifItem.title,
            body: notifItem.body,
            schedule: { at: targetDate },
            extra: {
              route: notifItem.route || '/',
              imageUrl: notifItem.imageUrl || '',
              word: notifItem.title
            },
            smallIcon: 'ic_stat_name',
            iconColor: '#EAB308',
            sound: 'notification_sound.mp3',
            attachments: notifItem.imageUrl ? [{ id: 'img', url: notifItem.imageUrl }] : []
          }
        ]
      });
      return { success: true, mode: 'native' };
    } else {
      // Web testing preview
      const delayMs = Math.max(1000, targetDate.getTime() - Date.now());
      setTimeout(() => {
        try {
          const audio = new Audio('/notification_sound.mp3');
          audio.play().catch(() => {});
        } catch (e) {}

        window.dispatchEvent(
          new CustomEvent('show-notification-preview', {
            detail: {
              title: notifItem.title,
              body: notifItem.body,
              route: notifItem.route || '/',
              imageUrl: notifItem.imageUrl || '',
              word: notifItem.title
            }
          })
        );
      }, Math.min(delayMs, 5000));

      return { success: true, mode: 'web' };
    }
  } catch (err) {
    console.error('Failed to schedule custom offline notification:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Fetch and sync all custom offline notifications from Supabase on app open
 */
export const syncCustomOfflineNotifications = async () => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'custom_offline_notifications_list')
      .single();

    if (!error && data && data.value) {
      const list = JSON.parse(data.value);
      localStorage.setItem('custom_offline_notifications', JSON.stringify(list));
      
      if (Capacitor.isNativePlatform()) {
        const now = Date.now();
        const pendingToSchedule = list.filter(n => new Date(n.scheduledAt).getTime() > now);
        
        for (const notifItem of pendingToSchedule) {
          await LocalNotifications.schedule({
            notifications: [{
              id: notifItem.id,
              title: notifItem.title,
              body: notifItem.body,
              schedule: { at: new Date(notifItem.scheduledAt) },
              extra: { route: notifItem.route || '/', word: notifItem.title },
              smallIcon: 'ic_stat_name',
              iconColor: '#EAB308',
              sound: 'notification_sound.mp3'
            }]
          });
        }
      }
    }
  } catch (e) {
    console.warn('Sync custom notifications error:', e);
  }
};
