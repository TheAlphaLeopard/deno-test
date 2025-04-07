document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.querySelector(".search-box");
  const searchButton = document.querySelector(".search-button");
  const cardGrid = document.querySelector(".card-grid");

  // Handle search button click
  searchButton.addEventListener("click", async function () {
    const query = searchBox.value.trim();
    if (query) {
      // Show loading message
      cardGrid.innerHTML = "<p>Loading...</p>";

      try {
        // Construct Pollinations URL
        const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(query)}`;
        console.log("Generated Pollinations URL:", pollinationsUrl);

        // Wait for the page to load
        const response = await fetch(pollinationsUrl);
        if (!response.ok) {
          throw new Error("Failed to load content from Pollinations.");
        }

        // Extract text content from the response
        const text = await response.text();

        // Display the extracted text in the card container
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <h2>Generated Content</h2>
          <div>${text}</div>
        `;
        cardGrid.innerHTML = ""; // Clear previous content
        cardGrid.appendChild(card);
      } catch (error) {
        console.error("Error fetching Pollinations content:", error);
        cardGrid.innerHTML = "<p>There was an error processing your request.</p>";
      }
    } else {
      alert("Please enter a valid query!");
    }
  });
});
