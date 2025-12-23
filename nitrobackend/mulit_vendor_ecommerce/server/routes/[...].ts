import { readFileSync } from 'fs';
import { resolve } from 'path';
import { defineEventHandler, createError } from 'h3';
export default defineEventHandler((event) => {
  const path = event.path;

  if (path.startsWith('/api/')) {
    // Unknown API route → return 404
    throw createError({
      statusCode: 404,
      message: `API route not found: ${path}`
    });
  }

  // Serve SPA for non-API routes
  try {
    const indexPath = resolve(process.cwd(), '../../admin/dist/index.html');
    const html = readFileSync(indexPath, 'utf-8');
    event.node.res.setHeader('Content-Type', 'text/html');
    return html;
  } catch (error) {
    throw createError({
      statusCode: 404,
      message: 'Admin panel not found. Build the admin first.'
    });
  }
});

