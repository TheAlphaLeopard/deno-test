import { parseGeneratedCode } from './parser.js';

document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.querySelector(".search-box");
  const searchButton = document.querySelector(".search-button");
  const cardGrid = document.querySelector(".card-grid");

  if (!searchBox || !searchButton || !cardGrid) {
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
    cardGrid.innerHTML = "<p>Generating...</p>";

    // Build a full prompt that instructs Pollinations to split output into HTML, CSS, and JS
    const fullPrompt = `Create a high quality, detailed, functional HTML game using this prompt: ${prompt}. Split the output into three parts: HTML, CSS, and JS. Return the HTML code wrapped in <html>...</html>, the CSS code wrapped in <style>...</style>, and the JavaScript code wrapped in <script>...</script>. Do not generate anything else.`;
    console.log("Full prompt:", fullPrompt);

    // Construct the API URL (Pollinations handles spaces automatically, but we'll encode it anyway)
    const apiUrl = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}`;
    console.log("Generated Pollinations URL:", apiUrl);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }
      const responseText = await response.text();
      console.log("Raw AI Response:", responseText);

      // Parse the response into its parts
      const { html, css, js } = parseGeneratedCode(responseText);
      console.log("Parsed output:", { html, css, js });

      // Update the HTML in the feed (assumed to be inside .card-grid)
      cardGrid.innerHTML = html || "<p>No HTML generated.</p>";

      // Inject CSS: create or update a <style> tag in the head
      let styleElement = document.getElementById("ai-generated-style");
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "ai-generated-style";
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = css;

      // Inject JS: remove previous script if exists and then append a new one
      let existingScript = document.getElementById("ai-generated-script");
      if (existingScript) {
        existingScript.remove();
      }
      if (js) {
        const scriptElement = document.createElement("script");
        scriptElement.id = "ai-generated-script";
        scriptElement.textContent = js;
        document.body.appendChild(scriptElement);
      }

      console.log("Content updated successfully.");
    } catch (error) {
      console.error("Error fetching or processing AI response:", error);
      cardGrid.innerHTML = "<p>Sorry, something went wrong. Please try again later.</p>";
    }
  });
});
