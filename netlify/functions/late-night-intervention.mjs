import { sendReminder } from '../lib/send-reminder.mjs';

export default async () => {
  await sendReminder('🚨 EMERGENCY ALERT', 'Miracleeee… why is the food delivery app open? CLOSE IT. Put the phone down, madam. Anna has been informed. 😭', 'late-night-intervention');
};

export const config = { schedule: '0 21 * * *' };
