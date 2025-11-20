import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: 'localhost',
    password: '1234',
    user: 'root',
    database: 'TOCAACAIPD',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

pool.getConnection()
  .then(conn => {
    console.log('✅ Conexão com MySQL estabelecida!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar no MySQL:', err.message);
  });

export default pool


