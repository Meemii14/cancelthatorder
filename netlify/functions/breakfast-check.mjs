import { sendReminder } from '../lib/send-reminder.mjs';

export default async () => {
  await sendReminder('🌞 GOOD MORNING, MIRACLEEEE', 'Good morning babe ❤️ Before you start browsing breakfast menus, remember: this is a weight-loss journey, not a food-app internship. 😭', 'breakfast-check');
};

export const config = { schedule: '0 8 * * *' };
