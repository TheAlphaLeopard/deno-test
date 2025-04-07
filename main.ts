import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { parseGeneratedCode } from './parser.js';

const PORT = 8000;

// Log incoming requests for better debugging
console.log(`Server running at http://localhost:${PORT}`);

serve(async (req) => {
  const url = new URL(req.url);
  console.log(`Request URL: ${url.pathname}`);

  // Serve static files (HTML, CSS, JS, etc.)
  if (url.pathname === "/") {
    const file = await Deno.readFile("./index.html");
    return new Response(file, {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (url.pathname === "/styles.css") {
    const file = await Deno.readFile("./styles.css");
    return new Response(file, {
      headers: { "Content-Type": "text/css" },
    });
  }

  if (url.pathname === "/script.js") {
    const file = await Deno.readFile("./script.js");
    return new Response(file, {
      headers: { "Content-Type": "application/javascript" },
    });
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
