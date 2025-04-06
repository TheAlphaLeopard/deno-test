import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Handle the API request for generating content using Pollinations AI
  if (url.pathname === "/api/generate" && req.method === "POST") {
    try {
      // Parse the incoming JSON request
      const body = await req.json();
      const { query } = body;

      console.log("Received query:", query);

      if (query) {
        try {
          // Send the query to Pollinations API to generate HTML
          const response = await fetch("https://text.pollinations.ai/feed", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: query,  // The query to generate HTML, CSS, and JS
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data from Pollinations API.");
          }

          // Parse the response from Pollinations
          const data = await response.json();
          console.log("Pollinations API response:", data);

          // Extract HTML from the response
          const generatedHtml = data.html || "<div>No content generated.</div>";

          return new Response(JSON.stringify({
            html: generatedHtml,
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } catch (error) {
          console.error("Pollinations API error:", error);
          return new Response(JSON.stringify({
            error: "Error fetching content from Pollinations API.",
          }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      } else {
        return new Response(JSON.stringify({
          error: "Query is missing.",
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(JSON.stringify({
        error: "Invalid request body.",
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Serve static files for other requests
  return serveDir(req);
});
