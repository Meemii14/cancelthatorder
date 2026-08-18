const $ = id => document.getElementById(id);

const jokes = [
  'Your delivery rider knows your address too well.',
  'This is not hunger. This is boredom wearing a wig.',
  'Put. The. Card. Down.',
  'Just because there is a discount does not mean it is destiny.',
  'Anna has not been cleared to bring extra food today.',
  'Opening the food delivery app is not a hobby.'
];

function status() {
  const h = new Date().getHours();
  if (h >= 18 && h < 22) {
    $('status').textContent = '🍽️ DINNER APPROVED 🎉';
    $('message').textContent = 'Congratulations, babe. The Ministry has officially approved dinner.';
  } else if (h >= 14 && h < 18) {
    $('status').textContent = '💧 Pap Water Intervention Time';
    $('message').textContent = 'Before discussing shawarma or anything fried... drink your pap water.';
  } else if (h >= 10 && h < 14) {
    $('status').textContent = '🤨 Suspicious Ordering Activity';
    $('message').textContent = 'Opening the food app is not a hobby, babe.';
  } else {
    $('status').textContent = '📱 Ordering Under Surveillance';
    $('message').textContent = 'The Ministry is watching suspicious food-related behaviour.';
  }
}

function drinkPap() {
  $('pap').textContent = '🥳 GOOD GIRL! Hydration achievement unlocked. The Ministry is proud.';
}

function noPap() {
  $('pap').textContent = 'Interesting. So pap water is a problem, but shawarma is somehow a possibility? The audacity is impressive.';
}

function investigate() {
  const f = $('food').value.trim();
  if (!f) {
    $('result').textContent = 'Nice try. Tell the Ministry what suspicious food item is being investigated.';
    return;
  }
  $('result').innerHTML = `🔍 INVESTIGATION COMPLETE.<br><br>So... you want <strong>${escapeHtml(f)}</strong>? Have you drunk your pap water, or are we just browsing menus recreationally?`;
  $('food').value = '';
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function anna() {
  $('anna').textContent = [
    '🚨 EVERYBODY STAY CALM. ANNA HAS STARTED COOKING. This is now a professional-level food threat.',
    '👩🏾‍🍳 Private chef activity confirmed. Anna has access to ingredients. You have access to a mouth. We need to act quickly.',
    '⚠️ Anna alert level: CRITICAL. One food source is enough for today. 😭'
  ][Math.floor(Math.random() * 3)];
}

function damage() {
  $('damage').textContent = 'Damage-control mode activated. The rider is already on the way, so enjoy your food. No guilt, no dramatic self-judgement. Tomorrow, we continue the journey. ❤️';
}

function intervene() {
  $('random').textContent = jokes[Math.floor(Math.random() * jokes.length)];
}

async function enableNotifications() {
  if (!('Notification' in window)) {
    $('notificationStatus').textContent = '😭 This browser does not support notifications.';
    return;
  }

  if (!('serviceWorker' in navigator)) {
    $('notificationStatus').textContent = '😭 This browser does not support the notification system.';
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    $('notificationStatus').textContent = '🔕 Notifications were not allowed. The Ministry is disappointed.';
    return;
  }

  $('notificationStatus').innerHTML = '✅ <strong>REMINDERS ACTIVATED.</strong><br>Miracleeee is now officially under surveillance. 😂';

  const registration = await navigator.serviceWorker.ready;
  registration.showNotification('🚨 MIRACLEEEE!', {
    body: 'The Ministry has successfully connected to your phone. ❤️',
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: 'miracleeee-test'
  });
}

const reminders = [
  { hour: 9, minute: 0, title: '🌞 GOOD MORNING, MIRACLEEEE', message: "New day. New goals. Please don't start it by browsing food apps. 😂" },
  { hour: 14, minute: 0, title: '💧 PAP WATER INSPECTION', message: 'Miracleeee... have you drunk your pap water?' },
  { hour: 18, minute: 0, title: '🍽️ DINNER APPROVED', message: 'Congratulations, babe. Dinner has officially received Ministry approval. ❤️' },
  { hour: 22, minute: 0, title: '🚨 LATE NIGHT ORDERING DETECTED', message: 'Miracleeee. Why are you opening the food app at this hour? 😭' }
];

const sentToday = {};

async function sendReminder(reminder) {
  const registration = await navigator.serviceWorker.ready;
  registration.showNotification(reminder.title, {
    body: reminder.message,
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: `miracleeee-${reminder.hour}-${reminder.minute}`,
    renotify: true
  });
}

function checkReminders() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const now = new Date();
  const keyDate = now.toISOString().slice(0, 10);

  reminders.forEach(reminder => {
    const key = `${keyDate}-${reminder.hour}-${reminder.minute}`;
    if (now.getHours() === reminder.hour && now.getMinutes() === reminder.minute && !sentToday[key]) {
      sentToday[key] = true;
      sendReminder(reminder);
    }
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(error => {
      console.error('Service worker registration failed:', error);
    });
  });
}

status();
setInterval(checkReminders, 60000);
