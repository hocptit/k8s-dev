const http = require('http');

// const targetUrl = 'http://<minikube-ip>'; // Replace with the target URL you want to forward traffic to
const targetUrl = process.env.TARGET_URL;

const server = http.createServer((req, res) => {
    const options = {
        hostname: new URL(targetUrl).hostname,
        // port: 31186, // Replace with the target port if applicable
        port: process.env.TARGET_PORT,
        path: req.url,
        method: req.method,
        headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    req.pipe(proxyReq);
});

const port = process.env.PORT; // Specify the port on which the proxy server should listen
server.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
// minikube ip
// TARGET_URL="http://192.168.49.2" TARGET_PORT=31186 PORT=31187  pm2 start index.js --name proxy-api-a
// TARGET_URL="http://192.168.49.2" TARGET_PORT=31186 PORT=31187  pm2 start index.js --name proxy-api-a  --update-env
// YOLOFCC