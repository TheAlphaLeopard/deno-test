document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.querySelector(".search-box");
  const cardGrid = document.querySelector(".card-grid");

  if (!searchBox || !cardGrid) {
    console.error("Missing .search-box or .card-grid element");
    return;
  }

  searchBox.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const prompt = searchBox.value.trim();
      if (!prompt) return;

      const encodedPrompt = encodeURIComponent(prompt);
      const url = `https://text.pollinations.ai/${encodedPrompt}`;

      console.log("Fetching from:", url);

      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.error("Pollinations fetch error:", await res.text());
          return;
        }

        const text = await res.text();

        // Extract the HTML content from the text response (basic heuristic)
        const htmlMatch = text.match(/<[^>]+>[\s\S]*<\/[^>]+>/);
        const extractedHTML = htmlMatch ? htmlMatch[0] : `<div>${text}</div>`;

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = extractedHTML;

        cardGrid.prepend(card); // Add newest result at the top
        searchBox.value = "";

      } catch (err) {
        console.error("Error fetching AI response:", err);
      }
    }
  });
});
