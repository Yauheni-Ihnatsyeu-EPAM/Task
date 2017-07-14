var http = require('http');
var url = require('url');
var db = require('./db');
var fs = require('fs');
var pdfKit = require('pdfkit');

var server = http.createServer();

server.on('request', (function(req, res) {

    if (req.url === '/favicon.ico') {
        res.end();
        return;
    }

    var name = url.parse(req.url, true).query.firstName;

    db.queryData(name, function(err, result) {
        console.log(result);
        if (err || result.length === 0) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(JSON.stringify({ firstName: (false) }));
            res.end();
            return;
        }
        var doc = new pdfKit();
        var buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', function() {
            buffers = Buffer.concat(buffers)
            db.updatePdf(JSON.stringify(buffers), name);
        });
        doc.text(`${result[0].firstName} + ${result[0].lastName} + ${result[0].image}`);
        doc.pipe(fs.createWriteStream('file.pdf'));
        doc.end();

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(JSON.stringify({ firstName: (true) }));
        res.end();
    });
}));

server.listen(8080);