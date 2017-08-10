var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123",
    database: "task"
});


module.exports = {
    connection: connection
};