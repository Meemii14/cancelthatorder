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

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

async function enableNotifications() {
  const statusEl = $('notificationStatus');

  if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    statusEl.textContent = '😭 Push notifications are not supported here. Open the HTTPS app URL in a supported browser.';
    return;
  }

  try {
    const permission = Notification.permission === 'granted'
      ? 'granted'
      : await Notification.requestPermission();

    if (permission !== 'granted') {
      statusEl.textContent = '🔕 Notifications were not allowed. The Ministry is disappointed.';
      return;
    }

    statusEl.textContent = '⏳ Connecting Miracleeee to the Ministry...';

    const registration = await navigator.serviceWorker.ready;
    const keyResponse = await fetch('/api/vapid-public-key');
    if (!keyResponse.ok) throw new Error('Push server is not running.');
    const { publicKey } = await keyResponse.json();

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
    }

    const saveResponse = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription })
    });

    if (!saveResponse.ok) throw new Error('Could not save push subscription.');

    statusEl.innerHTML = '✅ <strong>REMINDERS ACTIVATED.</strong><br>Test notification sent. Miracleeee is officially under surveillance. 😂';
  } catch (error) {
    console.error(error);
    statusEl.textContent = `😭 Couldn't activate reminders: ${error.message}`;
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(error => {
      console.error('Service worker registration failed:', error);
    });
  });
}

status();
