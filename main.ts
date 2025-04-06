// main.ts
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Handle /api/scrape endpoint
  if (url.pathname === "/api/scrape") {
    const targetUrl = url.searchParams.get("url");
    if (!targetUrl) {
      return new Response("Missing URL", { status: 400 });
    }

    try {
      const res = await fetch(targetUrl);
      const html = await res.text();

      // Simple regex to extract visible text (basic)
      const textOnly = html
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();

      return new Response(textOnly, {
        headers: { "Content-Type": "text/plain" }
      });
    } catch (err) {
      return new Response("Failed to scrape: " + err.message, { status: 500 });
    }
  }

  // Serve static files
  return serveDir(req);
});
