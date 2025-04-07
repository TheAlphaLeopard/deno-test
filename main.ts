import { serve } from "https://deno.land/std/http/server.ts";

const PORT = 8000;  // Make sure the server is running on the correct port

// Log incoming requests for better debugging
console.log(`Server running at http://localhost:${PORT}`);

serve(async (req) => {
  const url = new URL(req.url);
  console.log(`Request URL: ${url.pathname}`);

  // Serve the index.html file
  if (url.pathname === "/") {
    try {
      const file = await Deno.readTextFile("./index.html"); // Adjust the path if needed
      return new Response(file, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=UTF-8" },
      });
    } catch (error) {
      console.error("Error reading index.html:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  // Serve static files (e.g., CSS, JS, images)
  if (url.pathname.startsWith("/assets/")) {
    const filePath = `.${url.pathname}`;
    try {
      const file = await Deno.readFile(filePath);
      const ext = filePath.split('.').pop();

      const mimeTypes: { [key: string]: string } = {
        "css": "text/css",
        "js": "application/javascript",
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "svg": "image/svg+xml",
        "ico": "image/x-icon",
      };

      const contentType = mimeTypes[ext] || "application/octet-stream";
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
