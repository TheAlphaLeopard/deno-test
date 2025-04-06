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

      try {
        const aiRes = await fetch("https://text.pollinations.ai/feed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!aiRes.ok) {
          const errorText = await aiRes.text();
          console.error("❌ Pollinations API failed:", errorText);
          return new Response(JSON.stringify({ error: `Pollinations API error: ${errorText}` }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const aiData = await aiRes.json();
        console.log("✅ Pollinations API response:", aiData);

        return new Response(JSON.stringify({ html: aiData.html || "<div>No content generated.</div>" }), {
          headers: { "Content-Type": "application/json" },
        });

      } catch (err) {
        console.error("💥 Error calling Pollinations API:", err);
        return new Response(JSON.stringify({ error: `API call error: ${err.message}` }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

    } catch (err) {
      console.error("💥 JSON parsing error:", err);
      return new Response(JSON.stringify({ error: `Request parsing error: ${err.message}` }), {
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
