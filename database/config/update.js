const db = require('../db');

async function finalizeConfig(config) {
  await db.query(
    'UPDATE configs SET config = $2, scheduleTime = $3, endSession = $4 WHERE id = $1;',
    [config.id, config.config, config.scheduleTime, config.endSession],
  );
  const message = 'successful updated';
  return { message };
}

async function finishConfig(config, isError) {
  let details = 'successdetails';
  if (isError) {
    details = 'errdetails';
  }
  await db.query(
    `UPDATE configs SET ${details}= $2 WHERE id = $1;`,
    [config.id, config.details],
  );
  const message = 'successful updated';
  return { message };
}

async function unsetScheduling(id) {
  await db.query(
    'UPDATE configs SET scheduleTime = NULL WHERE id = $1;',
    [id],
  );
  const message = 'successful updated';
  return { message };
}
module.exports = { finalizeConfig, finishConfig, unsetScheduling };
