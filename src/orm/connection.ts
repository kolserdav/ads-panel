import mysql from 'mysql2';


const { DB_USER, DB_HOST, DB_NAME, DB_PASS }: any = process.env;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});

export default connection;
