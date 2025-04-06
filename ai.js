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
          console.log("Sending request to server with query:", query);  // Log query being sent

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
            const error = await response.text();
            console.error('Error response from server:', error);
            throw new Error(`Failed to fetch data from server: ${error}`);
          }

          const data = await response.json();
          console.log("Received data from the server:", data);

          // Clear the existing content in the card grid
          cardGrid.innerHTML = '';

          // Check if the HTML response is present, else show an error
          const newCard = document.createElement('div');
          newCard.classList.add('card');
          newCard.innerHTML = data.html || '<p>No content generated.</p>';
          cardGrid.appendChild(newCard);

        } catch (error) {
          console.error('Error generating content:', error);
          cardGrid.innerHTML = `<p>Error generating content: ${error.message}</p>`;
        }
      } else {
        cardGrid.innerHTML = '<p>Please enter a query.</p>';
      }
    }
  });
});
