document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.querySelector(".search-box");
  const searchButton = document.querySelector(".search-button");
  const cardGrid = document.querySelector(".card-grid");

  // Handle search button click
  searchButton.addEventListener("click", async function () {
    const query = searchBox.value.trim();
    if (query) {
      // Show loading or message indicating the action is in progress
      cardGrid.innerHTML = "<p>Loading...</p>";

      try {
        // Send the query to the server for Pollinations URL generation
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: query }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data from the server.");
        }

        const data = await response.json();
        console.log("Generated Pollinations URL:", data.url);

        // Wait for the Pollinations URL to load and fetch the HTML content
        const pollinationsResponse = await fetch(data.url);
        if (!pollinationsResponse.ok) {
          throw new Error("Failed to fetch content from Pollinations URL.");
        }

        const htmlContent = await pollinationsResponse.text();
        console.log("Fetched HTML content:", htmlContent);

        // Inject the fetched HTML content into the card grid
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = htmlContent;

        // Clear the current content and append the generated card
        cardGrid.innerHTML = "";
        cardGrid.appendChild(card);
      } catch (error) {
        console.error("Error fetching Pollinations URL:", error);
        cardGrid.innerHTML = "<p>There was an error processing your request.</p>";
      }
    } else {
      alert("Please enter a valid query!");
    }
  });
});
