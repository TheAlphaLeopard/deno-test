import { parseGeneratedCode } from "./parser.js";

document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.querySelector(".search-box");
  const searchButton = document.querySelector(".search-button");
  const feedContainer = document.querySelector(".card-grid");

  if (!searchBox || !searchButton || !feedContainer) {
    console.error("Required elements (.search-box, .search-button, .card-grid) not found");
    return;
  }

  searchButton.addEventListener("click", async function () {
    const prompt = searchBox.value.trim();
    if (!prompt) {
      console.log("No input provided");
      return;
    }

    console.log("User input:", prompt);
    // Show loading state
    feedContainer.innerHTML = "<p>Loading...</p>";

    // Build full prompt instructing Pollinations to split into HTML, CSS, and JS.
    const fullPrompt = `Create a high quality, detailed, functional HTML game using this prompt: ${prompt}. Please split your answer into three parts: HTML, CSS, and JS. Do not generate anything else.`;
    console.log("Full prompt for Pollinations AI:", fullPrompt);

    // Construct the URL for Pollinations AI.
    // (Pollinations handles spaces automatically, but we use encodeURIComponent here to be safe.)
    const apiUrl = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}`;
    console.log("Constructed Pollinations API URL:", apiUrl);

    try {
      // Fetch the AI-generated content
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }
      const responseText = await response.text();
      console.log("Raw AI response:", responseText);

      // Parse the response to extract HTML, CSS, and JS sections
      const { html, css, js } = parseGeneratedCode(responseText);
      console.log("Parsed content:", { html, css, js });

      // Clear the feed container and insert the HTML part
      feedContainer.innerHTML = html || "<p>No HTML content generated.</p>";

      // Inject CSS into the document head
      if (css) {
        const styleEl = document.createElement("style");
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
        console.log("CSS injected");
      }

      // Inject JS into the document body
      if (js) {
        const scriptEl = document.createElement("script");
        scriptEl.textContent = js;
        document.body.appendChild(scriptEl);
        console.log("JS injected");
      }
    } catch (error) {
      console.error("Error fetching or processing AI response:", error);
      feedContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });
});
