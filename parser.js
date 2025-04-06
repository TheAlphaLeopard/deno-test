export function parseGeneratedCode(text) {
    const htmlMatch = text.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
    const cssMatch = text.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const jsMatch = text.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  
    return {
      html: htmlMatch ? htmlMatch[1] : '',
      css: cssMatch ? cssMatch[1] : '',
      js: jsMatch ? jsMatch[1] : '',
    };
  }
  