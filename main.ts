import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { extname } from "https://deno.land/std@0.224.0/path/mod.ts";

console.log("✅ Deno server started");

serve(async (req) => {
  const url = new URL(req.url);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";

  try {
    const file = await Deno.readFile(`.${pathname}`);
    const contentType = getContentType(pathname);
    console.log(`📄 Serving ${pathname} as ${contentType}`);
    return new Response(file, {
      headers: {
        "content-type": contentType,
      },
    });
  } catch (err) {
    console.error(`❌ Could not serve ${pathname}:`, err);
    return new Response("Not Found", { status: 404 });
  }
});

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
