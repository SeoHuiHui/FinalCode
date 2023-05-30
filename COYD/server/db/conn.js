const mysql = require("mysql2");


const conn = mysql.createConnection({
    user:"admin",
    host:"mysql-db.cx7oaruqj7jl.ap-northeast-2.rds.amazonaws.com",
    password:"coydewha",
    database:"mysqlDB"
});


conn.connect((error)=>{
    if(error) throw error;
    console.log("connected !!")
});

module.exports = conn
