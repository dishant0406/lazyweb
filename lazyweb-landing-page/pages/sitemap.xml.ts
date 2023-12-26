import fs from 'fs';
import path from 'path';
import { GetServerSideProps } from 'next';

const generateSitemap = (pages:any) => {
  if (!Array.isArray(pages) || pages.length === 0) {
    throw new Error('No pages provided for the sitemap.');
  }

  const xmlUrls = pages.map(page => {
    const encodedUrl = encodeURI(page);
    // Determine change frequency and last modified date here, if needed.
    return `
      <url>
        <loc>${encodedUrl}</loc>
        <changefreq>daily</changefreq>
        <lastmod>
          ${new Date().toISOString()}
        </lastmod>
      </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="https://www.sitemaps.org/schemas/sitemap/0.9 https://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      ${xmlUrls}
    </urlset>`;
};


export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://lazyweb.rocks';

  // Recursive function to get page paths
  const getPages = (dir: string, baseDir: string = ''): string[] => {
    return fs.readdirSync(dir).reduce((allPages: string[], page: string) => {
      const fullPath = path.join(dir, page);
      const relativePath = path.join(baseDir, page).replace('.tsx', '').replace('.ts', '');

      if (fs.statSync(fullPath).isDirectory()) {
        return [...allPages, ...getPages(fullPath, relativePath)];
      }

      if (!['_app.tsx', '_document.tsx', '_error.tsx', 'sitemap.xml.ts'].includes(page)) {
        const formattedPath = relativePath === 'index' ? '' : relativePath;
        allPages.push(`${baseUrl}/${formattedPath}`);
      }

      return allPages;
    }, []);
  };

  // Get all pages
  const pages = getPages('pages');

  // Generate sitemap
  const sitemap: string = generateSitemap(pages); // Replace with your actual function

  // Set response header and send the sitemap
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
};


export default function SiteMap() {}