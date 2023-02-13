const mysql = require('mysql');
let dbConn;

if (!dbConn) {
    dbConn = mysql.createConnection({
        host: "mysql_server",
        port: 3306,
        database: "njs",
        user: "root",
        password: ""
    });

    dbConn.connect(function (err) {
        if (err) throw err;
        console.log("Connected to the database.");
    });
}

module.exports = dbConn;