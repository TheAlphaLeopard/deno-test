// parser.js
export function parseGeneratedCode(responseText) {
  try {
    // Use regex to extract content between <html>...</html>, <style>...</style>, and <script>...</script>
    const htmlMatch = responseText.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
    const cssMatch = responseText.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const jsMatch = responseText.match(/<script[^>]*>([\s\S]*?)<\/script>/i);

    return {
      html: htmlMatch ? htmlMatch[1].trim() : "",
      css: cssMatch ? cssMatch[1].trim() : "",
      js: jsMatch ? jsMatch[1].trim() : "",
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return { html: "", css: "", js: "" };
  }
}
