const db = require('../db');

async function newConfig(config) {
  const result = await db.query(
    'INSERT INTO configs(userID, userName, startSession, reservationDate) VALUES ($1, $2, $3, $4) RETURNING *',
    [config.userID, config.userName, config.startSession, config.reservationDate],
  );
  let message = 'Error in creating preset-config';

  if (result.length) {
    message = 'new preset-config created successfully';
  }

  return { message };
}

module.exports = { newConfig };
