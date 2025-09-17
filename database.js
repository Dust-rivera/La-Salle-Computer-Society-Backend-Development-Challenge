const mysql = require('mysql2');
module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'dustine',
    password: 'ChickenBanana',
    database: 'mouse_products',
});