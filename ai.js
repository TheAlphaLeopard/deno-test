document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.querySelector('.search-box');
  const sendButton = document.querySelector('.send-btn');
  const cardGrid = document.querySelector('.card-grid');

  sendButton.addEventListener('click', async () => {
    const query = searchBox.value.trim();
    if (!query) {
      console.log("Query is empty.");
      return;
    }

    console.log(`Sending query: ${query}`);

    try {
      // Send the query to the Deno backend API for generating content
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) {
        console.error("Error fetching AI content:", response.status);
        alert('Error fetching content from Pollinations AI.');
        return;
      }

      const data = await response.json();
      console.log("Received data:", data);

      // Clear the current feed
      cardGrid.innerHTML = '';

      // Replace the feed with the generated HTML
      cardGrid.innerHTML = data.html;

      // Inject CSS if present
      if (data.css) {
        const styleElement = document.createElement('style');
        styleElement.textContent = data.css;
        document.head.appendChild(styleElement);
      }

      // Inject JS if present
      if (data.js) {
        const scriptElement = document.createElement('script');
        scriptElement.textContent = data.js;
        document.body.appendChild(scriptElement);
      }

    } catch (error) {
      console.error("Error sending request:", error);
      alert('An error occurred while processing your request.');
    }
  });
});
