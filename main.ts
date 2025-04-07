import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { extname } from "https://deno.land/std@0.224.0/path/mod.ts";

const PORT = 8000;  // Set the server port

// Log incoming requests for better debugging
console.log(`Server running at http://localhost:${PORT}`);

serve(async (req) => {
  const url = new URL(req.url);
  console.log(`Request URL: ${url.pathname}`);

  // Serve the index.html file
  if (url.pathname === "/") {
    try {
      const file = await Deno.readTextFile("./index.html"); // Adjust the path to your index.html file
      return new Response(file, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=UTF-8" },
      });
    } catch (error) {
      console.error("Error reading index.html:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  // Serve static files (CSS, JS, images, etc.)
  if (url.pathname.startsWith("/assets/")) {
    const filePath = `.${url.pathname}`;
    try {
      const ext = extname(filePath).slice(1);  // Get file extension without dot
      let contentType: string;

      // Set appropriate content type for CSS, JS, and image files
      switch (ext) {
        case "css":
          contentType = "text/css";
          break;
        case "js":
          contentType = "application/javascript";
          break;
        case "png":
          contentType = "image/png";
          break;
        case "jpg":
        case "jpeg":
          contentType = "image/jpeg";
          break;
        case "svg":
          contentType = "image/svg+xml";
          break;
        case "ico":
          contentType = "image/x-icon";
          break;
        default:
          contentType = "application/octet-stream";
          break;
      }

      const file = await Deno.readFile(filePath);
      return new Response(file, {
        status: 200,
        headers: { "Content-Type": contentType },
      });
    } catch (error) {
      console.error(`Error reading static file ${url.pathname}:`, error);
      return new Response("Not Found", { status: 404 });
    }
  }

  // Handle the API request for generating content using Pollinations AI
  if (url.pathname === "/api/generate" && req.method === "POST") {
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

          // Return the generated HTML
          return new Response(JSON.stringify({
            html: data, // Directly use the raw response text from Pollinations
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

  // Default response for unknown routes
  return new Response("Not Found", { status: 404 });
});
