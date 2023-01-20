const mysql = require('mysql2')

const connection = mysql.createConnection(
  {
    host: 'root',
    passwrod: 'windowssql',
    database: 'employees_db',
  },
  console.log('connected to employees_db database'),
)

module.export = connection