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

  // Handle API endpoint for fetching content from Pollinations AI
  if (pathname.startsWith("/api/generate/")) {
    const prompt = pathname.replace("/api/generate/", "").trim();
    console.log("Received prompt:", prompt);

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    try {
      // Construct Pollinations URL
      const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
      console.log("Fetching from Pollinations URL:", pollinationsUrl);

      const response = await fetch(pollinationsUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch content from Pollinations");
      }

      const text = await response.text();
      console.log("Fetched text from Pollinations:", text);

      return new Response(text, { headers: { "Content-Type": "text/plain" } });
    } catch (error) {
      console.error("Error in /api/generate endpoint:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  // Serve static files dynamically
  try {
    // For root, serve index.html
    if (pathname === "/" || pathname === "/index.html") {
      const file = await Deno.readFile(join(ROOT_DIR, "index.html"));
      return new Response(file, { headers: { "Content-Type": "text/html" } });
    }

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
