import { serve } from "std/http/server.ts";


const PORT = 8000;  // Make sure you run the server on the correct port

// Log incoming requests for better debugging
console.log(`Server running at http://localhost:${PORT}`);

serve(async (req) => {
  const url = new URL(req.url);
  console.log(`Request URL: ${url.pathname}`);

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
          const response = await fetch("https://text.pollinations.ai/feed", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: query,  // The query for generating HTML, CSS, and JS
            }),
          });

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

          const data = await response.json();
          console.log("Pollinations API response:", data);

          // Ensure the HTML is in the response
          const generatedHtml = data.html || "<div>No content generated.</div>";

          // Return the generated HTML
          return new Response(JSON.stringify({
            html: generatedHtml,
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

  // Serve static files for other requests
  return new Response("Not Found", { status: 404 });
});
