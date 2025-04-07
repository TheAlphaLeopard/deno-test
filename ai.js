document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.querySelector(".search-box");
  const searchButton = document.querySelector(".search-button");
  const cardGrid = document.querySelector(".card-grid");

  // Handle search button click
  searchButton.addEventListener("click", function () {
    const query = searchBox.value.trim();
    if (query) {
      // Show loading message
      cardGrid.innerHTML = "<p>Loading...</p>";

      // Construct Pollinations URL
      const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(query)}`;
      console.log("Generated Pollinations URL:", pollinationsUrl);

      // Create and append iframe
      const iframe = document.createElement("iframe");
      iframe.src = pollinationsUrl;
      iframe.style.width = "100%";
      iframe.style.height = "500px";
      iframe.onload = function () {
        try {
          // Access iframe document
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          // Extract text content
          const textContent = iframeDoc.body.innerText || iframeDoc.body.textContent;
          console.log("Extracted Text Content:", textContent);
          // Display the extracted text
          cardGrid.innerHTML = `<pre>${textContent}</pre>`;
        } catch (error) {
          console.error("Error extracting content from iframe:", error);
          cardGrid.innerHTML = "<p>Failed to extract content.</p>";
        }
      };
      iframe.onerror = function () {
        console.error("Error loading iframe.");
        cardGrid.innerHTML = "<p>Failed to load content.</p>";
      };
      cardGrid.innerHTML = ""; // Clear previous content
      cardGrid.appendChild(iframe);
    } else {
      alert("Please enter a valid query!");
    }
  });
});
