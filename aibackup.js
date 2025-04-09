document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.querySelector(".search-box");
  const searchButton = document.querySelector(".search-button");
  const feedContainer = document.querySelector(".card-grid");

  if (!searchBox || !searchButton || !feedContainer) {
    console.error("Required elements not found");
    return;
  }

  // Handle search button click
  searchButton.addEventListener("click", async function () {
    const prompt = searchBox.value.trim();
    if (!prompt) {
      console.log("No input provided");
      return;
    }

    console.log("User input:", prompt);

    // Show loading state or any visual feedback if needed
    feedContainer.innerHTML = "<p>Loading...</p>";

    // Construct the URL for Pollinations API
    const apiUrl = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;

    try {
      // Fetch the AI response from Pollinations
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const aiContent = await response.text();

      // Clear loading text and display the AI-generated content
      feedContainer.innerHTML = aiContent;
      console.log("AI Content:", aiContent);
    } catch (error) {
      console.error("Error fetching from Pollinations API:", error);
      feedContainer.innerHTML = "<p>Sorry, something went wrong. Please try again later.</p>";
    }
  });
});
