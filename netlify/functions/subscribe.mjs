import { getStore } from '@netlify/blobs';

const json = (data, status = 200) => Response.json(data, { status });

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const { subscription } = await req.json();
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return json({ error: 'Invalid subscription' }, 400);
    }

    const store = getStore('cancel-that-order-reminders');
    const subscriptions = (await store.get('subscriptions', { type: 'json' })) || [];
    const exists = subscriptions.some(item => item.endpoint === subscription.endpoint);

    if (!exists) {
      subscriptions.push(subscription);
      await store.setJSON('subscriptions', subscriptions);
    }

    return json({ ok: true, message: 'Miracleeee has joined the Ministry.' });
  } catch (error) {
    console.error('Subscription error:', error);
    return json({ error: 'Could not save subscription' }, 500);
  }
};
