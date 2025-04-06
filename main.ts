// main.ts
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Handle /api/scrape endpoint
  if (url.pathname === "/api/scrape") {
    const targetUrl = url.searchParams.get("url");
    if (!targetUrl) {
      console.log("❌ No URL provided");
      return new Response("Missing URL", { status: 400 });
    }

    console.log(`🌐 URL entered: ${targetUrl}`);
    console.log("🔍 Scrape starting...");

    try {
      const res = await fetch(targetUrl);
      const html = await res.text();

      console.log("📄 HTML fetched, processing...");

      const textOnly = html
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();

      console.log("✅ Scrape finished!");
      return new Response(textOnly, {
        headers: { "Content-Type": "text/plain" }
      });
    } catch (err) {
      console.log(`❌ Error while scraping: ${err.message}`);
      return new Response("Failed to scrape: " + err.message, { status: 500 });
    }
  }

  // Serve static files
  return serveDir(req);
});
