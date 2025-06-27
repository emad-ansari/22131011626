export interface UrlEntry {
  originalUrl: string;
  createdAt: string;
  expiry: string;
}

export const urlStore: { [shortcode: string]: UrlEntry } = {}; 