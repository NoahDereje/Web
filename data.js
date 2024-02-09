// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "cse-mysql-classes-01.cse.umn.edu",// this will work
  user: "C4131F23U55",
  database: "C4131F23U55",
  password: "3075", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

// later you can use connPool.awaitQuery(query, data) -- it will return a promise for the query results.


async function addContact(name, email, date, dropdown, checkbox) {
  const query = 'INSERT INTO contact (name, email, date, dropdown, checkbox) VALUES (?, ?, ?, ?, ?)';
  const result = await connPool.awaitQuery(query, [name, email, date, dropdown, checkbox]);
  return result.insertId;
}

async function deleteContact(contactId) {
  const query = 'DELETE FROM contact WHERE id = ?';
  const result = await connPool.awaitQuery(query, [contactId]);
  return result.affectedRows > 0;
}

async function getContacts() {
  const query = 'SELECT * FROM contact';
  const result = await connPool.awaitQuery(query);
  return result;
}

async function addSale(message) {
  const query = 'INSERT INTO sale (sale_message, start_sale) VALUES (?, CURRENT_TIMESTAMP)';
  await connPool.awaitQuery(query, [message]);
}


async function endSales() {
  const query = 'UPDATE sale SET end_sale = CURRENT_TIMESTAMP WHERE end_sale IS NULL';
  const result = await connPool.awaitQuery(query);
  return result.affectedRows > 0;
}

async function getRecentSales() {
  const query = 'SELECT * FROM sale ORDER BY start_sale DESC LIMIT 3';
  const result = await connPool.awaitQuery(query);
  return result;
}

module.exports = { addContact, getContacts, deleteContact, addSale, endSales, getRecentSales };