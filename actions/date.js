const files = require('../helpers/files');
const database = require('../database/config/index');
const constants = require('../helpers/const');
const logger = require('../logger/logger');

function getKeyboard() {
  return files.GetConfig().map((c) => [{ text: c.name, callback_data: `config-${c.fileName}` }]);
}
function getKeyboardNow() {
  return files.GetConfig().map((c) => [{ text: c.name, callback_data: `config-now-${c.fileName}` }]);
}

async function Action(ctx) {
  logger.info('Action select date', { userID: ctx.chat.id });
  logger.debug('Action select date - details', { ctx });
  const dateRaw = ctx.callbackQuery.data;
  let reservationDateTimestamp = dateRaw.replace(/date-/g, '');
  if (dateRaw.includes('now')) {
    reservationDateTimestamp = dateRaw.replace(/date-now-/g, '');
  }
  const reservationDate = new Date(parseInt(reservationDateTimestamp, 10));
  ctx.reply(`Your date is: ${reservationDate.toDateString()}`).then(() => {
    logger.info('Action date: select date: Success', { userID: ctx.chat.id, reservationDate: reservationDate.toString() });
    logger.debug('Action date: select date: Success - details', { ctx, reservationDate: reservationDate.toString() });
  });
  reservationDate.setHours(
    constants.ReservationTime.getHours(),
    constants.ReservationTime.getMinutes(),
    constants.ReservationTime.getSeconds(),
  );

  // insert new config
  const create = await database.create.newConfig(
    {
      userID: ctx.chat.id,
      userName: ctx.chat.username,
      startSession: new Date().toUTCString(),
      reservationDate: reservationDate.toUTCString(),
    },
  );
  logger.info('Action date: insert new config', { userID: ctx.chat.id, reservationDate: reservationDate.toString(), response: create });
  let keyboard = getKeyboard();
  if (dateRaw.includes('now')) {
      keyboard = getKeyboardNow();
  }

  const response = await ctx.telegram.sendMessage(ctx.chat.id, 'Choose your tennis config:', {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
  logger.debug('Action date: select config', { userID: ctx.chat.id, response });
}
module.exports = { Action };
