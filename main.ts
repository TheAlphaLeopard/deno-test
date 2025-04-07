import { serve } from "std/http/server.ts";
import { join } from "std/path/mod.ts";
import { extname } from "std/path/mod.ts";

const PORT = 8000;  // Make sure you run the server on the correct port

// Log incoming requests for better debugging
console.log(`Server running at http://localhost:${PORT}`);

serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Serve static files
  const filePath = join(Deno.cwd(), path);
  try {
    const fileStats = await Deno.stat(filePath);
    if (fileStats.isDirectory) {
      return new Response("Directory listing not supported", { status: 403 });
    }

    const fileExtension = extname(filePath);
    const mimeType = getMimeType(fileExtension);

    if (mimeType) {
      const file = await Deno.readFile(filePath);
      return new Response(file, {
        status: 200,
        headers: { "Content-Type": mimeType },
      });
    }
  } catch (error) {
    console.error("Error serving static file:", error);
  }

  // Handle the API request for generating content using Pollinations AI
  if (path === "/api/generate" && req.method === "POST") {
    try {
      const body = await req.json();
      const { query } = body;

      console.log("Received query:", query);

      if (query) {
        // Construct the Pollinations URL based on user input
        const url = `https://text.pollinations.ai/${encodeURIComponent(query)}`;
        console.log("Generated Pollinations URL:", url);

        // Return the Pollinations URL to the frontend
        return new Response(JSON.stringify({ url }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(JSON.stringify({ error: "Missing query in request." }), { status: 400 });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      return new Response(JSON.stringify({ error: "Error processing the request." }), { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
});

// Helper function to get MIME type based on file extension
function getMimeType(extension: string): string | undefined {
  const mimeTypes: { [key: string]: string } = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".json": "application/json",
  };

  return mimeTypes[extension.toLowerCase()];
}
