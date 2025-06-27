import { Request, Response } from 'express';
import { urlStore } from '../models/urlModel';
import { Log } from '../Logging-Middleware/logger';

export async function shortenUrl(req: Request, res: Response) {
  const { originalUrl, validity, shortcode } = req.body;
  if (!originalUrl || typeof originalUrl !== 'string') {
    await Log('backend', 'error', 'controller', 'Missing or invalid originalUrl');
    return res.status(400).json({ error: 'originalUrl is required' });
  }
  let code = shortcode;
  if (!code || typeof code !== 'string') {
    code = Math.random().toString(36).substr(2, 6);
  }
  if (urlStore[code]) {
    await Log('backend', 'warn', 'controller', 'Shortcode already exists');
    return res.status(409).json({ error: 'Shortcode already exists' });
  }
  const expiry = new Date(Date.now() + (Number(validity) || 30) * 60000).toISOString();
  urlStore[code] = { originalUrl, createdAt: new Date().toISOString(), expiry };
  await Log('backend', 'info', 'controller', `Shortened URL: ${originalUrl} -> ${code}`);
  res.json({ shortLink: `http://localhost:${process.env.PORT || 8080}/${code}`, expiry });
}

export async function getStatistics(req: Request, res: Response) {
  const stats = Object.entries(urlStore).map(([shortcode, data]) => ({
    shortcode,
    shortLink: `http://localhost:${process.env.PORT || 8080}/${shortcode}`,
    originalUrl: data.originalUrl,
    createdAt: data.createdAt,
    expiresAt: data.expiry,
    totalClicks: 0,
    clickData: [],
  }));
  await Log('backend', 'info', 'controller', 'Fetched statistics');
  res.json(stats);
} 