import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { extname } from "https://deno.land/std@0.224.0/path/mod.ts";

console.log("🚀 Server running...");

serve(async (req) => {
  const url = new URL(req.url);
  const pathname = decodeURIComponent(url.pathname);
  console.log(`🔗 Incoming request: ${req.method} ${pathname}`);

  // === Handle AI POST endpoint ===
  if (pathname === "/api/generate" && req.method === "POST") {
    try {
      const body = await req.json();
      const { query } = body;

      console.log("📥 Received query:", query);

      if (!query) {
        return new Response(JSON.stringify({ error: "Missing 'query' in request body." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const encodedPrompt = encodeURIComponent(query);
      const aiURL = `https://text.pollinations.ai/${encodedPrompt}`;
      console.log(`🌐 Fetching AI content from: ${aiURL}`);

      try {
        const res = await fetch(aiURL);
        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Pollinations AI error:", errorText);
          return new Response(JSON.stringify({ error: "Pollinations AI request failed." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const html = await res.text();
        console.log("✅ AI HTML received.");

        return new Response(JSON.stringify({ html }), {
          headers: { "Content-Type": "application/json" },
        });

      } catch (err) {
        console.error("💥 Fetch error:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch AI content." }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

    } catch (err) {
      console.error("💥 JSON parsing error:", err);
      return new Response(JSON.stringify({ error: "Invalid request body." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // === Serve Static Files ===
  let filePath = pathname === "/" ? "/index.html" : pathname;

  try {
    const file = await Deno.readFile(`.${filePath}`);
    const contentType = getContentType(filePath);
    console.log(`📄 Serving static file: ${filePath}`);
    return new Response(file, {
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.warn(`❓ Static file not found: ${filePath}`);
    return new Response("Not Found", { status: 404 });
  }
});

// === Helper to detect content type ===
function getContentType(path: string): string {
  const ext = extname(path);
  const map: Record<string, string> = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain",
  };
  return map[ext] || "application/octet-stream";
}
