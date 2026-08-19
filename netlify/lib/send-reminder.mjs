import { getStore } from '@netlify/blobs';
import webpush from 'web-push';

export async function sendReminder(title, body, tag) {
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:hello@example.com';
  const publicKey = 'BBY8qbIdmwwM3Ok7l_qkRbgwaA5lcqSSAMJP-hsH4BJ1oau_0Lrz2QjQxnlBUqAUxQWr5JjjQ2y-d9nIoi1-bD4';

  if (!privateKey) throw new Error('Missing VAPID_PRIVATE_KEY environment variable');

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const store = getStore('cancel-that-order-reminders');
  const subscriptions = (await store.get('subscriptions', { type: 'json' })) || [];
  const payload = JSON.stringify({ title, body, tag });
  const survivors = [];

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(subscription, payload);
      survivors.push(subscription);
    } catch (error) {
      if (error.statusCode !== 404 && error.statusCode !== 410) {
        console.error('Push failed:', error.statusCode || error.message);
        survivors.push(subscription);
      }
    }
  }

  await store.setJSON('subscriptions', survivors);
  return { sent: survivors.length };
}
