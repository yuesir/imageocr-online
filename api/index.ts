/**
 * Vercel deploy entry handler, for serverless deployment, please don't modify this file
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from './app.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Use the Express app as middleware
  return app(req as any, res as any);
}