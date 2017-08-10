const http = require('http');
const Promise = require("bluebird");
const url = require('url');
const db = require('./db');

const fs = require('fs');
const pdfKit = Promise.promisifyAll(require("pdfKit"));


var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "task"
});

Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

const server = http.createServer();

console.log("bo");

server.on('request', (function(req, res) {

    if (req.url === '/favicon.ico') {
        res.end();
        return;
    }

    var name = url.parse(req.url, true).query.firstName;
    let sql = `SELECT firstName, lastName, image 
                        FROM data 
                        WHERE firstName LIKE '${name}%'`;

    connection.queryAsync(sql)
        .then(result => {
            var doc = new pdfKit();
            var buffers = [];
            doc.onAsync('data').then(result => {
                console.log(data);
                buffers.push.bind(buffers);
            });
            doc.onAsync('end').then(() => {

                buffers = Buffer.concat(buffers);
                return buffers;
            }).then(buffers => {
                let sql = `UPDATE data 
                            SET pdf = '${JSON.stringify(buffers)}' 
                            WHERE firstName LIKE '${name}%'`;
                connection.queryAsync(sql).catch((err) => { if (err) return; });
            });
            return result;

        }).then(result => {
            console.log('text');
            doc.text(`${result[0].firstName} + ${result[0].lastName} + ${result[0].image}`);
            doc.pipe(fs.createWriteStream('file.pdf'));
            doc.end();
        }).then(() => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(JSON.stringify({ firstName: (true) }));
            res.end();
        }).catch(err => {
            console.log("error");
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.write(JSON.stringify({ firstName: (false) }));
            res.end();
        })



}))



server.listen(8080);