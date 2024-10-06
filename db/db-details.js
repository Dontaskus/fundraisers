const mysql = require('mysql2');
module.exports = {
  connection:()=>mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crowdfunding_db'
  })}
  
