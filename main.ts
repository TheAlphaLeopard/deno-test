import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.224.0/path/mod.ts";
import { parseGeneratedCode } from './parser.js';

// Define the root directory and port
const PORT = 8000;
const ROOT_DIR = "./"; // Set to the root of your project

// Mime types for different file extensions
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

// Log incoming requests for better debugging
console.log(`Server running at http://localhost:${PORT}`);

serve(async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;
  console.log(`Request URL: ${pathname}`);

  // If the path is empty or is the root path, serve index.html
  if (pathname === "/") {
    const file = await Deno.readFile(join(ROOT_DIR, "index.html"));
    return new Response(file, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Serve static files dynamically based on the file extension
  try {
    const filePath = join(ROOT_DIR, pathname);  // Get the file path
    const fileExtension = extname(filePath);     // Get the file extension
    const mimeType = MIME_TYPES[fileExtension];  // Get the MIME type based on the file extension

    if (mimeType) {
      // Read and serve the file based on the MIME type
      const file = await Deno.readFile(filePath);
      return new Response(file, {
        headers: { "Content-Type": mimeType },
      });
    }

    // If no matching MIME type is found, return a 404 response
    return new Response("Not Found", { status: 404 });

  } catch (error) {
    // If there is an error reading the file, return a 404 response
    console.error(`Error serving file: ${error}`);
    return new Response("Not Found", { status: 404 });
  }

  // Handle the API request for generating content using Pollinations AI
  if (pathname === "/api/generate" && req.method === "POST") {
    try {
      // Parse the incoming JSON request body
      const body = await req.json();
      const { query } = body;
      console.log("Received query:", query);

      if (query) {
        try {
          // Send the query to Pollinations API to generate HTML content
          const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(query)}`);
          
          // Check if Pollinations API responded successfully
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Pollinations API returned an error:", errorText);
            return new Response(JSON.stringify({
              error: `Pollinations API failed: ${errorText}`,
            }), {
              status: 500,
              headers: { "Content-Type": "application/json" }
            });
          }

          const data = await response.text();
          console.log("Pollinations API response:", data);

          // Parse the response and return the generated HTML, CSS, and JS
          const { html, css, js } = parseGeneratedCode(data);

          // Return the generated HTML, CSS, and JS
          return new Response(JSON.stringify({
            html: html,
            css: css,
            js: js,
          }), {
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

  // Return "Not Found" for other requests
  return new Response("Not Found", { status: 404 });
});
