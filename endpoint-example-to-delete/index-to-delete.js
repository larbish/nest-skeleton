/**
 * This file is a simple node server express used only in order to test skeleton example routes (users)
 * You can delete it once you will implement your own route
 */

var http = require('http');

var hostname = '127.0.0.1';
var port = 3000;

var server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/users/1') {
        res.statusCode = 200;
        res.end(JSON.stringify({ id: 1, fullName: 'Baptiste Leproux' }));
    } else if (req.url.includes('users')) {
        res.statusCode = 404;
        res.end();
    } else {
        res.statusCode = 500;
        res.end();
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
