const $ = id => document.getElementById(id);

const jokes = [
  'Your delivery rider knows your address too well. We need to discuss this.',
  'This is not hunger. This is boredom wearing a wig.',
  'Put. The. Card. Down.',
  'Just because there is a discount does not mean it is destiny.',
  'Anna has not been cleared to bring extra food today.',
  'Opening the food delivery app is not a hobby, Miracleeee.',
  'The app is open again? Fascinating behaviour.'
];

function status() {
  const h = new Date().getHours();
  if (h >= 18 && h < 22) {
    $('status').textContent = '🍽️ DINNER IS APPROVED 🎉';
    $('message').textContent = 'Congratulations, babe. You may now eat without triggering an investigation. Because we are not monsters. 😭❤️';
  } else if (h >= 14 && h < 18) {
    $('status').textContent = '💧 PAP WATER INSPECTION';
    $('message').textContent = 'Before discussing shawarma, pizza or anything fried... where is the pap water? 👀';
  } else if (h >= 10 && h < 14) {
    $('status').textContent = '🤨 SUSPICIOUS ORDERING ACTIVITY';
    $('message').textContent = 'Miracleeee. Opening the food app is not a hobby. Close it with confidence.';
  } else if (h >= 22) {
    $('status').textContent = '🚨 LATE-NIGHT ORDERING DETECTED';
    $('message').textContent = 'Why is the food delivery app open at this hour? Put the phone down, madam. 😭';
  } else {
    $('status').textContent = '📱 MIRACLEEEE IS UNDER SURVEILLANCE';
    $('message').textContent = 'The Ministry has detected suspicious food-related behaviour. We are observing quietly. 👀';
  }
}

function drinkPap() { $('pap').textContent = '🥳 GOOD GIRL! Pap water successfully located. The Ministry will reduce surveillance for the next 17 minutes.'; }
function noPap() { $('pap').textContent = 'Interesting. Pap water is apparently difficult, but ordering shawarma is somehow effortless? The audacity is impressive. 😭'; }
function investigate() {
  const f = $('food').value.trim();
  if (!f) { $('result').textContent = 'Nice try. Tell the Ministry what suspicious food item is currently occupying your thoughts.'; return; }
  $('result').innerHTML = `🔍 <strong>INVESTIGATION COMPLETE.</strong><br><br>So... you want <strong>${escapeHtml(f)}</strong>? Have you checked whether Anna is bringing food, or are we browsing menus recreationally again? 🤨`;
  $('food').value = '';
}
function escapeHtml(value) { return value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
function anna() { $('anna').textContent = ['🚨 EVERYBODY STAY CALM. ANNA HAS BEEN INFORMED. She may already be reaching for ingredients.', '👩🏾‍🍳 Anna has received the report. Please remain where you are and step away from the delivery app.', '⚠️ ANNA ALERT LEVEL: CRITICAL. One food source is enough for today. We repeat: Anna exists. 😭', '📞 Anna is probably wondering why her friend is trying to order food again while she can literally bring something.'][Math.floor(Math.random() * 4)]; }
function damage() { $('damage').textContent = 'Okay, okay. The rider is already coming. 😭 Eat your food, enjoy your food, and do not punish yourself over it. Tomorrow we continue the journey. The Ministry believes in you. ❤️'; }
function intervene() { $('random').textContent = jokes[Math.floor(Math.random() * jokes.length)]; }

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

async function enableNotifications() {
  const statusEl = $('notificationStatus');
  if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    statusEl.textContent = '😭 Your browser said “absolutely not.” Open this site in a browser that supports push notifications.';
    return;
  }

  try {
    statusEl.textContent = '👀 Miracleeee is being asked to join the Ministry...';
    const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
    if (permission !== 'granted') {
      statusEl.textContent = '🔕 Permission denied. The Ministry has been respectfully kicked out of your phone. 😭';
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const keyResponse = await fetch('/.netlify/functions/public-key');
    if (!keyResponse.ok) throw new Error('The Ministry could not find its keys.');
    const { publicKey } = await keyResponse.json();

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
    }

    const saveResponse = await fetch('/.netlify/functions/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription })
    });
    if (!saveResponse.ok) throw new Error('The Ministry failed to save this phone. Very embarrassing.');

    await registration.showNotification('🎉 REMINDERS ACTIVATED!', {
      body: 'Miracleeee, the Ministry is officially connected to your phone. ❤️ This is your test reminder. Now put the food app down. 😭',
      tag: 'ministry-test',
      renotify: true
    });

    statusEl.innerHTML = '✅ <strong>WELCOME TO THE MINISTRY OF MINDING YOUR BUSINESS.</strong><br>This phone is now registered for the scheduled reminders, and your test notification has been dispatched. 😭❤️';
  } catch (error) {
    console.error(error);
    statusEl.textContent = `😭 The Ministry tripped over its own shoelaces: ${error.message}`;
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(error => console.error('Service worker registration failed:', error)));
}

status();
