const db = require('../db');
const helper = require('../helpers');

async function lastSession() {
  const rows = await db.query(
    'SELECT * FROM configs WHERE startsession > NOW() - INTERVAL \'1 minutes\' ORDER BY startSession DESC LIMIT 1;',
    [],
  );
  const data = helper.emptyOrRows(rows);
  return data;
}

async function jobToSchedule() {
  const rows = await db.query(
    'SELECT * FROM configs WHERE scheduletime > NOW();',
    [],
  );
  const data = helper.emptyOrRows(rows);
  return data;
}

module.exports = { lastSession, jobToSchedule };
