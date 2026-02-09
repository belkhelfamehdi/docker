const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({
    message: 'Hello from Docker!',
    environment: process.env.APP_ENV,
    timestamp: new Date().toISOString(),
    hostname: require('os').hostname()
  }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.APP_ENV} mode`);
});
