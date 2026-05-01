export async function initiateFlutterwavePayment(data: {
  amount: number;
  currency: string;
  email: string;
  tx_ref: string;
}) {
  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: data.tx_ref,
      amount: data.amount,
      currency: data.currency,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-callback`,
      customer: {
        email: data.email,
      },
      customizations: {
        title: 'TzDalali Marketplace',
        logo: 'https://tzdalali.com/logo.png',
      },
    }),
  });
  return await response.json();
}
