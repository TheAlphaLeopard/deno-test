import { parseGeneratedCode } from './parser.js';

const searchBox = document.querySelector('.search-box');
const feed = document.querySelector('.feed');

searchBox.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const query = searchBox.value.trim();
    if (!query) return;

    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`https://text.pollinations.ai/${encodedQuery}`);
    const responseText = await response.text();

    const { html, css, js } = parseGeneratedCode(responseText);

    // Replace the feed with generated HTML
    document.querySelector('.feed').innerHTML = html;

    // Inject CSS
    if (css) {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    }

    // Inject JS
    if (js) {
      const script = document.createElement('script');
      script.textContent = js;
      document.body.appendChild(script);
    }
  }
});
