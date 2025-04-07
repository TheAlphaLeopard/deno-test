// parser.js
export function parseGeneratedCode(responseText) {
  try {
    // Look for <html>...</html> block
    const htmlMatch = responseText.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
    // Look for <style>...</style> block
    const cssMatch = responseText.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    // Look for <script>...</script> block
    const jsMatch = responseText.match(/<script[^>]*>([\s\S]*?)<\/script>/i);

    const htmlContent = htmlMatch ? htmlMatch[1].trim() : "";
    const cssContent = cssMatch ? cssMatch[1].trim() : "";
    const jsContent = jsMatch ? jsMatch[1].trim() : "";

    return {
      html: htmlContent,
      css: cssContent,
      js: jsContent,
    };
  } catch (error) {
    console.error("Error parsing generated content:", error);
    return { html: "", css: "", js: "" };
  }
}
