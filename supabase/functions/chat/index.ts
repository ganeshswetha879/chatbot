import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENROUTER_API_KEY = "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";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/stackblitz/webcontainer-core",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});