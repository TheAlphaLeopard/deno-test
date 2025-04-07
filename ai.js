document.addEventListener("DOMContentLoaded", function () {
  const promptInput = document.getElementById("promptInput");
  const searchButton = document.querySelector(".search-button");
  const cardGrid = document.querySelector(".card-grid");

  if (!promptInput || !searchButton || !cardGrid) {
    console.error("Required elements not found");
    return;
  }

  // Handle search button click
  searchButton.addEventListener("click", function () {
    const prompt = promptInput.value.trim();
    if (!prompt || prompt === "Generating...") return;

    console.log("Prompt submitted:", prompt);

    // Show loading state
    cardGrid.innerHTML = "<p>Generating...</p>";

    // Construct Pollinations URL
    const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    console.log("Generated Pollinations URL:", pollinationsUrl);

    // Fetch content from Pollinations AI
    fetch(pollinationsUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((text) => {
        console.log("Fetched text from Pollinations:", text);
        // Display the extracted text
        cardGrid.innerHTML = `<pre>${text}</pre>`;
      })
      .catch((error) => {
        console.error("Error fetching content:", error);
        cardGrid.innerHTML = "<p>Error generating content. Please try again.</p>";
      });
  });
});
