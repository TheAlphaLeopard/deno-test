import { parseGeneratedCode } from './parser.js';

const searchBox = document.querySelector('.search-box');
const feed = document.querySelector('.feed');

searchBox.addEventListener('keydown', async (event) => {
  // Log when the event listener is triggered
  console.log('Event listener triggered');

  if (event.key === 'Enter') {
    const query = searchBox.value.trim();
    if (!query) return;

    console.log(`Query submitted: ${query}`);
    const encodedQuery = encodeURIComponent(query);

    try {
      // Make the API call
      const response = await fetch(`https://text.pollinations.ai/${encodedQuery}`);
      
      // Check for API success
      if (!response.ok) {
        console.error(`API request failed with status: ${response.status}`);
        alert('There was an issue fetching the AI-generated content.');
        return;
      }

      const responseText = await response.text();
      console.log('AI response received successfully');

      // Parse the HTML, CSS, and JS
      const { html, css, js } = parseGeneratedCode(responseText);

      // Clear the feed and replace it with new content
      const cardGrid = document.querySelector('.card-grid');
      cardGrid.innerHTML = html;

      // If CSS is present, inject it into the page
      if (css) {
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
        console.log('CSS injected successfully');
      }

      // If JS is present, inject it into the page
      if (js) {
        const scriptElement = document.createElement('script');
        scriptElement.textContent = js;
        document.body.appendChild(scriptElement);
        console.log('JS injected successfully');
      }

    } catch (error) {
      console.error("Error fetching or processing AI response:", error);
      alert('There was an error processing your request.');
    }
  }
});
