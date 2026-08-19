import { sendReminder } from '../lib/send-reminder.mjs';

export default async () => {
  await sendReminder('💧 PAP WATER INSPECTION', 'Miracleeee. Before discussing shawarma, pizza or anything fried... where is the pap water? 👀 Drink it, madam. The Ministry is watching.', 'pap-water-check');
};

export const config = { schedule: '0 13 * * *' };
