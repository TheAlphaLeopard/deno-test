export function parseGeneratedCode(responseText) {
  try {
    // Regex to extract the HTML, CSS, and JS from the response
    const htmlMatch = responseText.match(/<html.*?>([\s\S]*?)<\/html>/);
    const cssMatch = responseText.match(/<style.*?>([\s\S]*?)<\/style>/);
    const jsMatch = responseText.match(/<script.*?>([\s\S]*?)<\/script>/);

    // Parse the HTML, CSS, and JS (if available)
    const html = htmlMatch ? htmlMatch[1] : "<div>No HTML content generated.</div>";
    const css = cssMatch ? cssMatch[1] : "";
    const js = jsMatch ? jsMatch[1] : "";

    return { html, css, js };
  } catch (error) {
    console.error("Error parsing the response:", error);
    return { html: "<div>Error parsing AI response</div>", css: "", js: "" };
  }
}
