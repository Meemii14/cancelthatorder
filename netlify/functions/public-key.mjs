const PUBLIC_KEY = 'BBY8qbIdmwwM3Ok7l_qkRbgwaA5lcqSSAMJP-hsH4BJ1oau_0Lrz2QjQxnlBUqAUxQWr5JjjQ2y-d9nIoi1-bD4';

export default async () => {
  return Response.json({ publicKey: PUBLIC_KEY });
};
