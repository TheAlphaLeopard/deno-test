import { parseGeneratedCode } from './parser.js';

const searchBox = document.querySelector('.search-box');
const feed = document.querySelector('.feed');
const cardGrid = feed.querySelector('.card-grid'); // The container where cards go

searchBox.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const query = searchBox.value.trim();
    if (!query) return;

    console.log(`User query: ${query}`);

    // Make the request to Pollinations AI
    const encodedQuery = encodeURIComponent(query);
    console.log(`Encoded query: ${encodedQuery}`);

    try {
      const response = await fetch(`https://text.pollinations.ai/${encodedQuery}`);
      if (!response.ok) {
        console.error('Failed to fetch data from Pollinations API.');
        return;
      }

      const responseText = await response.text();
      console.log('Received AI response:', responseText);

      // Parse the response for HTML, CSS, and JS
      const { html, css, js } = parseGeneratedCode(responseText);

      // Clear the current feed content
      console.log('Clearing feed content...');
      cardGrid.innerHTML = ''; // Clear existing cards

      // Insert the parsed HTML
      if (html) {
        console.log('Injecting HTML into feed...');
        feed.innerHTML = html;
      }

      // Insert CSS into the document
      if (css) {
        console.log('Injecting CSS...');
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
      }

      // Insert JS into the document
      if (js) {
        console.log('Injecting JS...');
        const script = document.createElement('script');
        script.textContent = js;
        document.body.appendChild(script);
      }
    } catch (error) {
      console.error('Error fetching AI data:', error);
    }
  }
});
