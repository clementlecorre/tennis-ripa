const logger = require('../logger/logger');
const date = require('../helpers/date');

function getKeyboard() {
  return date.GetDates(date.GetFromDate(), date.GetEndDate()).map((d) => [{ text: d.toDateString(), callback_data: `date-${d.getTime()}` }]);
}

async function Command(ctx) {
  logger.debug('Commands: /add', { userID: ctx.chat.id });
  const response = await ctx.telegram.sendMessage(ctx.chat.id, 'Select your next date', {
    reply_markup: {
      inline_keyboard: getKeyboard(),
    },
  });
  logger.info('Commands: /add: Success', { userID: ctx.chat.id });
  logger.debug('Commands: /add: Success - details', { response });
}

module.exports = { Command };
