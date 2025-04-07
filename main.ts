import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { parseGeneratedCode } from './parser.js';

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

  // Serve the index.html for the root path
  if (pathname === "/") {
    const file = await Deno.readFile(join(ROOT_DIR, "index.html"));
    return new Response(file, { headers: { "Content-Type": "text/html" } });
  }

  // Serve static files dynamically
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

  // Handle API requests for Pollinations AI
  if (pathname === "/api/generate" && req.method === "POST") {
    try {
      const body = await req.json();
      const { query } = body;
      console.log("Received query:", query);

      if (query) {
        try {
          // Construct Pollinations API URL with proper query encoding
          const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(query)}`;
          console.log("Requesting Pollinations API with URL:", pollinationsUrl);

          // Make the fetch request to Pollinations API
          const response = await fetch(pollinationsUrl);

          // Log the Pollinations API response
          console.log("Pollinations API response status:", response.status);
          const responseText = await response.text();
          console.log("Pollinations API response text:", responseText);

          if (!response.ok) {
            console.error("Error from Pollinations API:", responseText);
            return new Response(JSON.stringify({ error: "Pollinations API error: " + responseText }), {
              status: 500,
              headers: { "Content-Type": "application/json" }
            });
          }

          // Parse the response and extract HTML, CSS, JS
          const { html, css, js } = parseGeneratedCode(responseText);
          console.log("Generated HTML, CSS, and JS:", { html, css, js });

          // Return the generated HTML, CSS, JS in the response
          return new Response(JSON.stringify({ html, css, js }), {
            headers: { "Content-Type": "application/json" }
          });

        } catch (error) {
          console.error("Error calling Pollinations API:", error);
          return new Response(JSON.stringify({
            error: `Error calling Pollinations API: ${error.message}`,
          }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
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
