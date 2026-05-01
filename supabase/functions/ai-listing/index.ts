import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Anthropic } from "https://esm.sh/@anthropic-ai/sdk@0.9.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const anthropic = new Anthropic({
  apiKey: Deno.env.get("ANTHROPIC_API_KEY") || "",
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { details, type } = await req.json();

    const prompt = `Write a professional, luxury-oriented listing description for a ${type} with the following details: ${JSON.stringify(details)}. Make it engaging and emphasize the global legal protection and escrow guarantee provided by TzDalali.`;

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const description = message.content[0].text;

    return new Response(JSON.stringify({ description }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
