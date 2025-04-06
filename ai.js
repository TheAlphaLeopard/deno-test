document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("prompt-input");
  const cardContainer = document.getElementById("card-container");

  async function generateContent(prompt) {
    try {
      console.log("📤 Sending prompt:", prompt);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Server error:", errorText);
        cardContainer.innerHTML = `<p style="color: red;">Server error: ${errorText}</p>`;
        return;
      }

      const data = await response.json();
      console.log("✅ Received HTML:", data.html);
      cardContainer.innerHTML = data.html;
    } catch (err) {
      console.error("💥 Fetch failed:", err);
      cardContainer.innerHTML = `<p style="color: red;">Failed to fetch AI response.</p>`;
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const prompt = input.value.trim();
      if (prompt) {
        generateContent(prompt);
      }
    }
  });
});
