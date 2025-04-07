import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.224.0/path/mod.ts";

const PORT = 8000;
const ROOT_DIR = "./"; // Root directory

const MIME_TYPES: { [key: string]: string } = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.txt': 'text/plain',
};

console.log(`Server running at http://localhost:${PORT}`);

serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;
  console.log(`Request URL: ${pathname}`);

  // Serve static files
  if (pathname === "/") {
    const file = await Deno.readFile(join(ROOT_DIR, "index.html"));
    return new Response(file, { headers: { "Content-Type": "text/html" } });
  }

  // Serve other static files
  try {
    const filePath = join(ROOT_DIR, pathname);
    const fileExtension = extname(filePath);
    const mimeType = MIME_TYPES[fileExtension];

    if (mimeType) {
      const file = await Deno.readFile(filePath);
      return new Response(file, { headers: { "Content-Type": mimeType } });
    }

    return new Response("Not Found", { status: 404 });

  } catch (error) {
    console.error(`Error serving file: ${error}`);
    return new Response("Not Found", { status: 404 });
  }

  // Handle API requests for Pollinations URL generation
  if (pathname === "/api/generate" && req.method === "POST") {
    try {
      const body = await req.json();
      const { query } = body;
      console.log("Received query:", query);

      if (query) {
        // Construct Pollinations URL
        const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(query)}`;
        console.log("Generated Pollinations URL:", pollinationsUrl);

        // Return the Pollinations URL
        return new Response(JSON.stringify({ url: pollinationsUrl }), {
          headers: { "Content-Type": "application/json" }
        });

      } else {
        console.log("Missing query in the request body.");
        return new Response(JSON.stringify({
          error: "Query is missing in the request.",
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (error) {
      console.error("Error parsing the request body:", error);
      return new Response(JSON.stringify({
        error: `Error parsing request: ${error.message}`,
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response("Not Found", { status: 404 });
});
