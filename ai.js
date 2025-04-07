document.addEventListener("DOMContentLoaded", function () {
  const searchBox = document.querySelector(".search-box");
  const searchButton = document.querySelector(".search-button");

  if (!searchBox || !searchButton) {
    console.error("Required elements not found");
    return;
  }

  // Handle search button click
  searchButton.addEventListener("click", function () {
    const prompt = searchBox.value.trim();
    if (!prompt) {
      console.log("No input provided");
      return;
    }

    console.log("User input:", prompt);

    // Show an alert with the text from the search box
    alert("Input received: " + prompt);
  });
});
