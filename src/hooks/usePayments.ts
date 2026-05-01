import { supabase } from '@/integrations/supabase/client'

export function usePayments() {
  const createPaymentIntent = async (data: {
    amount: number;
    currency: string;
    gateway: 'stripe' | 'flutterwave' | 'paystack';
    method?: string;
    metadata?: Record<string, unknown>;
  }) => {
    const { data: response, error } = await supabase.functions.invoke('payments', {
      body: data
    });

    if (error) throw error;
    return response;
  };

  return { createPaymentIntent };
}
