const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile('./404.html', (error, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content || '404 - File Not Found', 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      // Add PWA headers
      const headers = {
        'Content-Type': mimeType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };

      // Special headers for service worker
      if (filePath.includes('sw.js')) {
        headers['Service-Worker-Allowed'] = '/';
      }

      // HTTPS simulation headers for PWA testing
      if (req.url === '/manifest.json') {
        headers['Access-Control-Allow-Origin'] = '*';
      }

      res.writeHead(200, headers);
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('For PWA testing, you may need to use HTTPS. Consider using:');
  console.log('- ngrok: npx ngrok http 3000');
  console.log('- or serve over HTTPS for full PWA functionality');
});
