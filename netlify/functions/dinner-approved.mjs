import { sendReminder } from '../lib/send-reminder.mjs';

export default async () => {
  await sendReminder('🍽️ DINNER IS APPROVED 🎉', 'Congratulations, Miracleeee. You may now eat without triggering an investigation. Because we are not monsters. 😭❤️', 'dinner-approved');
};

export const config = { schedule: '0 17 * * *' };
