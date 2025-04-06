document.addEventListener('DOMContentLoaded', () => {
  const searchBox = document.querySelector('.search-box');
  const cardGrid = document.querySelector('.card-grid');

  // Handle the 'Enter' key press event on the search box
  searchBox.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();  // Prevent default Enter behavior (form submission, etc.)

      const query = searchBox.value.trim();
      if (query) {
        try {
          // Send the query to the backend API
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: query,  // The query from the search box
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch data from Pollinations API');
          }

          const data = await response.json();

          // Clear the existing content in the card grid
          cardGrid.innerHTML = '';

          // Parse and insert the HTML response into the grid
          const newCard = document.createElement('div');
          newCard.classList.add('card');
          newCard.innerHTML = data.html || 'No content generated.';
          cardGrid.appendChild(newCard);

        } catch (error) {
          console.error('Error generating content:', error);
          cardGrid.innerHTML = '<p>Error generating content. Please try again later.</p>';
        }
      } else {
        cardGrid.innerHTML = '<p>Please enter a query.</p>';
      }
    }
  });
});
