var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "task"
});

function queryData(name, callback) {
    var sql = `SELECT firstName, lastName, image 
    FROM data 
    WHERE firstName LIKE '${name}%'`;
    connection.query(sql, callback);
}

function updatePdf(pdfData, name, callback) {
    var sql = `UPDATE data 
            SET pdf = '${JSON.stringify(pdfData)}' 
            WHERE firstName LIKE '${name}%'`;
    connection.query(sql, (err) => { if (err) return; });
}

module.exports = {
    queryData: queryData,
    updatePdf: updatePdf
};