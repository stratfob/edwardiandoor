const app = require('../app');
const https = require('https');
const fs = require('fs');
const http = require('http');

const privateKey = fs.readFileSync('../private.key');
const certificate = fs.readFileSync('../certificate.crt');
const DEBUG = true;

if (DEBUG) {
    app.set('port', 3000);
    http.createServer(app).listen(3000);
} else {
    app.set('port', 443);
    https.createServer({
        key: privateKey,
        cert: certificate
    }, app).listen(443);
    http.createServer(function (req, res) {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    }).listen(80);
}


