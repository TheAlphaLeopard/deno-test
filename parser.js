export function parseGeneratedCode(responseText) {
    console.log("Parsing the generated response...");
  
    // Extract HTML, CSS, and JS using regex
    const htmlMatch = responseText.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
    const cssMatch = responseText.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const jsMatch = responseText.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  
    // Log the extracted HTML, CSS, and JS
    console.log("Parsed HTML:", htmlMatch ? htmlMatch[1] : 'No HTML found');
    console.log("Parsed CSS:", cssMatch ? cssMatch[1] : 'No CSS found');
    console.log("Parsed JS:", jsMatch ? jsMatch[1] : 'No JS found');
  
    // Return the parsed code
    return {
      html: htmlMatch ? htmlMatch[1] : '',
      css: cssMatch ? cssMatch[1] : '',
      js: jsMatch ? jsMatch[1] : ''
    };
  }
  