
// const { Client } = require('pg');
// const util = require('util');

// const db = new Client({
//   user: 'postgres',
//   password: 'soda123!@#',
//   host: 'localhost',
//   port: '5432',
//   database: 'NIT',
// });

// db.connect()
//   .then(() => {
//     console.log('Connected to PostgreSQL database');
//   })
//   .catch((err) => {
//     console.error('Error connecting to PostgreSQL database', err);
//   });

// db.query = util.promisify(db.query).bind(db);

// const executeTransaction = async (callback) => {
//   const client = await db.connect();
//   try {
//     await client.query('BEGIN');
//     try {
//       await callback(client);
//       await client.query('COMMIT');
//     } catch (e) {
//       await client.query('ROLLBACK');
//     }
//   } finally {
//     client.release();
//   }
// };

// module.exports = {
//   db,
//   executeTransaction,
// };



const { Client } = require('pg');
const util = require('util');

const db = new Client({
  user: 'postgres',
  password: 'soda@168',
  host: 'localhost',
  port: '5432',
  database: 'NIT',
});


db.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });

//db.query = util.promisify(db.query).bind(db);

module.exports = db;



// const { Client } = require('pg');
// const util = require('util');

// const db = new Client({
//   user: 'postgres',
//   password: 'soda123!@#',
//   host: 'localhost',
//   port: 5432,
//   database: 'NIT',
// });

// db.connect()
//   .then(() => {
//     console.log('Connected to PostgreSQL database');
//   })
//   .catch((err) => {
//     console.error('Error connecting to PostgreSQL database', err);
//   });

// db.query = util.promisify(db.query).bind(db);

// // Begin transaction
// const beginTransaction = async () => {
//   try {
//     await db.query('BEGIN');
//     console.log('Transaction started');
//   } catch (err) {
//     console.error('Error starting transaction', err);
//   }
// };

// // Commit transaction
// const commitTransaction = async () => {
//   try {
//     await db.query('COMMIT');
//     console.log('Transaction committed');
//   } catch (err) {
//     console.error('Error committing transaction', err);
//   }
// };

// // Rollback transaction
// const rollbackTransaction = async () => {
//   try {
//     await db.query('ROLLBACK');
//     console.log('Transaction rolled back');
//   } catch (err) {
//     console.error('Error rolling back transaction', err);
//   }
// };

// module.exports = {
//   db,
//   beginTransaction,
//   commitTransaction,
//   rollbackTransaction,
// };