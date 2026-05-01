export async function initializePaystackTransaction(data: {
  amount: number;
  email: string;
  reference: string;
}) {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      amount: data.amount * 100,
      reference: data.reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-callback`,
    }),
  });
  return await response.json();
}
