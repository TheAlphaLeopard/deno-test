// parser.js
export function parseGeneratedCode(responseText) {
    try {
      // Extract HTML content
      const htmlMatch = responseText.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
      const htmlContent = htmlMatch ? htmlMatch[1] : '';
      
      // Extract CSS content
      const cssMatch = responseText.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      const cssContent = cssMatch ? cssMatch[1] : '';
      
      // Extract JavaScript content
      const jsMatch = responseText.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      const jsContent = jsMatch ? jsMatch[1] : '';
      
      return { html: htmlContent, css: cssContent, js: jsContent };
    } catch (error) {
      console.error("Error parsing generated content:", error);
      return { html: '', css: '', js: '' };
    }
  }
  