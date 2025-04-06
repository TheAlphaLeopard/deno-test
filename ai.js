// Fetch the input box and the feed container
const searchBox = document.querySelector('.search-box');
const feedContainer = document.querySelector('.card-grid');

// Function to handle key press events on the search box
searchBox.addEventListener('keypress', async (event) => {
  // Check if the Enter key is pressed
  if (event.key === 'Enter') {
    const query = searchBox.value.trim();

    if (query) {
      try {
        // Send a GET request to Pollinations.ai to get text feed
        const response = await fetch(`https://text.pollinations.ai/feed`);
        
        if (response.ok) {
          // Parse the response
          const data = await response.json();
          console.log('AI Generated Data:', data);

          // Assuming the data returned contains HTML, CSS, and JS code
          const generatedHTML = data.html || '';
          const generatedCSS = data.css || '';
          const generatedJS = data.js || '';

          // Update the container with the new HTML
          feedContainer.innerHTML = generatedHTML;

          // If CSS is provided, inject it into the page
          if (generatedCSS) {
            const style = document.createElement('style');
            style.innerHTML = generatedCSS;
            document.head.appendChild(style);
          }

          // If JS is provided, evaluate it
          if (generatedJS) {
            const script = document.createElement('script');
            script.innerHTML = generatedJS;
            document.body.appendChild(script);
          }

          // Optionally, clear the search box after the request
          searchBox.value = '';
        } else {
          console.error('Error fetching AI data:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
});
