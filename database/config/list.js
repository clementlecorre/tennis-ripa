const config = require('../../config');
const helper = require('../helpers');
const db = require('../db');

async function list(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    'SELECT * FROM configs OFFSET $1 LIMIT $2',
    [offset, config.listPerPage],
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };
  return {
    data,
    meta,
  };
}
module.exports = { list };
