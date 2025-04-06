// main.ts
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // New endpoint for generating code based on API keys
  if (url.pathname === "/api/generate" && req.method === "POST") {
    const body = await req.json();
    const { openaiKey, huggingfaceKey, pollinationsEnabled } = body;
    console.log("Received API keys:");
    console.log("OpenAI:", openaiKey);
    console.log("HuggingFace:", huggingfaceKey);
    console.log("Pollinations Enabled:", pollinationsEnabled);

    // For test purposes, generate dummy code using the provided keys
    const generatedHtml = `<div><h2>Welcome to digisim.ai!</h2><p>OpenAI Key: ${openaiKey}</p></div>`;
    const generatedJs = `console.log("Using HuggingFace Key: ${huggingfaceKey}");`;
    // Use proper pollinations.ai domain if enabled
    const pollinationsNote = pollinationsEnabled
      ? "Pollinations.ai enabled (using https://www.pollinations.ai)"
      : "Pollinations.ai disabled";
    const generatedCss = `body { background: #222; color: #fff; } /* ${pollinationsNote} */`;

    return new Response(JSON.stringify({
      html: generatedHtml,
      js: generatedJs,
      css: generatedCss
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // Serve static files for other requests
  return serveDir(req);
});
