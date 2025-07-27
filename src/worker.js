/**
 * Cloudflare Worker for serving DesignOps Model Advisor React SPA
 * Handles static asset serving and SPA routing
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    try {
      // Try to get the asset from the assets binding
      let asset;
      
      // Handle root path
      if (pathname === '/') {
        asset = await env.ASSETS.fetch(new URL('/index.html', request.url));
      } else {
        // Try to fetch the exact path first
        asset = await env.ASSETS.fetch(request);
        
        // If asset not found and it's not an API call or file with extension,
        // serve index.html for SPA routing
        if (asset.status === 404 && !pathname.includes('.') && !pathname.startsWith('/api/')) {
          asset = await env.ASSETS.fetch(new URL('/index.html', request.url));
        }
      }

      // Clone the response to modify headers
      const response = new Response(asset.body, {
        status: asset.status,
        statusText: asset.statusText,
        headers: asset.headers,
      });

      // Add security headers
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

      // Add cache headers based on file type
      if (pathname.includes('/assets/')) {
        // Cache static assets for 1 year
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (pathname.endsWith('.html') || pathname === '/') {
        // Cache HTML for 5 minutes
        response.headers.set('Cache-Control', 'public, max-age=300');
      }

      return response;

    } catch (error) {
      console.error('Worker error:', error);
      
      // Return a basic error page
      return new Response(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>DesignOps Model Advisor - Error</title>
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 50px; }
            .error { color: #dc2626; }
          </style>
        </head>
        <body>
          <h1>DesignOps Model Advisor</h1>
          <p class="error">Sorry, there was an error loading the application.</p>
          <p>Please try refreshing the page.</p>
        </body>
        </html>
        `,
        {
          status: 500,
          headers: {
            'Content-Type': 'text/html',
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
          },
        }
      );
    }
  },
};
