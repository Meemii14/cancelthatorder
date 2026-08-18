import express from 'express';
import webpush from 'web-push';
import cron from 'node-cron';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'subscriptions.json');

const app = express();
app.use(express.json({ limit: '50kb' }));
app.use(express.static(__dirname));

function loadSubscriptions() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveSubscriptions(subscriptions) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(subscriptions, null, 2));
}

function getVapidKeys() {
  const existing = process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY
    ? { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY }
    : webpush.generateVAPIDKeys();

  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:hello@example.com',
    existing.publicKey,
    existing.privateKey
  );

  return existing;
}

const vapid = getVapidKeys();

const reminders = [
  { hour: 9, minute: 0, title: '🌞 GOOD MORNING, MIRACLEEEE', message: "New day. New goals. Please don't start it by browsing food apps. 😂" },
  { hour: 14, minute: 0, title: '💧 PAP WATER INSPECTION', message: 'Miracleeee... have you drunk your pap water?' },
  { hour: 18, minute: 0, title: '🍽️ DINNER APPROVED', message: 'Congratulations, babe. Dinner has officially received Ministry approval. ❤️' },
  { hour: 22, minute: 0, title: '🚨 LATE NIGHT ORDERING DETECTED', message: 'Miracleeee. Why are you opening the food app at this hour? 😭' }
];

async function pushToAll(payload) {
  const subscriptions = loadSubscriptions();
  const survivors = [];

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(subscription, JSON.stringify(payload), { TTL: 3600 });
      survivors.push(subscription);
    } catch (error) {
      // 404/410 means the browser subscription is no longer valid.
      if (error.statusCode !== 404 && error.statusCode !== 410) survivors.push(subscription);
    }
  }

  saveSubscriptions(survivors);
}

app.get('/api/vapid-public-key', (_req, res) => {
  res.json({ publicKey: vapid.publicKey });
});

app.post('/api/subscribe', async (req, res) => {
  const subscription = req.body?.subscription;
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return res.status(400).json({ error: 'Invalid push subscription.' });
  }

  const subscriptions = loadSubscriptions();
  const exists = subscriptions.some(item => item.endpoint === subscription.endpoint);
  if (!exists) {
    subscriptions.push(subscription);
    saveSubscriptions(subscriptions);
  }

  // Immediate test sample after permission + subscription succeeds.
  await pushToAll({
    title: '🎉 REMINDERS ACTIVATED!',
    message: 'Miracleeee, the Ministry is officially connected to your phone. ❤️ This is your test reminder.'
  });

  res.json({ ok: true, message: 'Subscribed. Test notification sent.' });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timezone: 'Africa/Lagos', subscribers: loadSubscriptions().length });
});

// Runs every minute using Lagos/WAT time. node-cron supports the timezone option.
cron.schedule('* * * * *', async () => {
  const now = new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(new Date());
  const hour = Number(now.find(p => p.type === 'hour')?.value);
  const minute = Number(now.find(p => p.type === 'minute')?.value);
  const reminder = reminders.find(item => item.hour === hour && item.minute === minute);
  if (reminder) {
    await pushToAll({ title: reminder.title, message: reminder.message });
    console.log(`Sent reminder: ${reminder.title}`);
  }
}, { timezone: 'Africa/Lagos' });

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Cancel That Order running on port ${PORT}`);
  console.log('Reminder timezone: Africa/Lagos (WAT)');
  console.log('Reminder times:', reminders.map(r => `${String(r.hour).padStart(2, '0')}:${String(r.minute).padStart(2, '0')}`).join(', '));
});
