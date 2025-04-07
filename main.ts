import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.224.0/path/mod.ts";

const PORT = 8000;
const ROOT_DIR = "./"; // Root directory for static files

const MIME_TYPES: { [key: string]: string } = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".txt": "text/plain",
};

console.log(`Server running at http://localhost:${PORT}`);

serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;
  console.log(`Request URL: ${pathname}`);

  try {
    // For root, serve index.html
    if (pathname === "/" || pathname === "/index.html") {
      const file = await Deno.readFile(join(ROOT_DIR, "index.html"));
      return new Response(file, { headers: { "Content-Type": "text/html" } });
    }

    // For any other file, serve it dynamically based on file extension.
    const filePath = join(ROOT_DIR, pathname);
    const fileExtension = extname(filePath);
    const mimeType = MIME_TYPES[fileExtension];
    if (mimeType) {
      const file = await Deno.readFile(filePath);
      return new Response(file, { headers: { "Content-Type": mimeType } });
    }
    return new Response("Not Found", { status: 404 });
  } catch (error) {
    console.error("Error serving file:", error);
    return new Response("Not Found", { status: 404 });
  }
});
