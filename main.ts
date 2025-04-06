import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Handle the API request for generating code
  if (url.pathname === "/api/generate" && req.method === "POST") {
    try {
      // Parse the incoming JSON request
      const body = await req.json();
      const { openaiKey, huggingfaceKey, pollinationsEnabled, query } = body;

      console.log("Received request for code generation:");
      console.log("OpenAI Key:", openaiKey);
      console.log("HuggingFace Key:", huggingfaceKey);
      console.log("Pollinations Enabled:", pollinationsEnabled);
      console.log("Query:", query);

      // If Pollinations is enabled, fetch data from Pollinations API
      if (pollinationsEnabled) {
        try {
          // Send the request to Pollinations API
          const response = await fetch("https://text.pollinations.ai/feed");

          if (!response.ok) {
            throw new Error("Failed to fetch data from Pollinations API.");
          }

          // Parse the response from Pollinations
          const data = await response.json();
          console.log("Pollinations API response:", data);

          // Extract HTML, CSS, and JS from the response
          const generatedHtml = data.html || "<div>AI-generated HTML will appear here.</div>";
          const generatedCss = data.css || "body { background: #222; color: white; }";
          const generatedJs = data.js || `console.log("Pollinations JS Loaded!");`;

          return new Response(JSON.stringify({
            html: generatedHtml,
            js: generatedJs,
            css: generatedCss
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } catch (error) {
          console.error("Error fetching from Pollinations API:", error);
          return new Response(JSON.stringify({
            error: "Failed to fetch from Pollinations API",
            message: error.message
          }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }

      // If Pollinations is not enabled, generate dummy data for testing purposes
      const generatedHtml = `<div><h2>Welcome to digisim.ai!</h2><p>OpenAI Key: ${openaiKey}</p></div>`;
      const generatedJs = `console.log("Using HuggingFace Key: ${huggingfaceKey}");`;
      const generatedCss = `body { background: #222; color: #fff; }`;

      console.log("Returning dummy data as Pollinations is not enabled.");

      // Return dummy data as JSON
      return new Response(JSON.stringify({
        html: generatedHtml,
        js: generatedJs,
        css: generatedCss
      }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (error) {
      console.error("Error processing request:", error);
      return new Response(JSON.stringify({
        error: "Failed to process the request",
        message: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Serve static files for other requests (e.g., HTML, CSS, JS)
  return serveDir(req);
});
