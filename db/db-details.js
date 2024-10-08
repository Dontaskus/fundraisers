const mysql = require('mysql2');
module.exports = {
  connection:()=>mysql.createConnection({
    host: 'https://23875883.it.scu.edu.au/',
    user: 'nanier10_nanier',
    password: 'o[(gNl@lX#ry',
    database: 'nanier10_crowdfundraisers_db'
  })}
  
