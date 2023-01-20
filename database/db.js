const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.db);

/**
 * Query the database using the pool
 * @param {*} q
 * @param {*} params
 *
 * @see https://node-postgres.com/features/pooling#single-query
 */
async function query(q, params) {
  const { rows } = await pool.query(q, params);

  return rows;
}

module.exports = {
  query,
};
