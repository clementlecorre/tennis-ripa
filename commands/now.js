const logger = require('../logger/logger');
const date = require('../helpers/date');

function getKeyboard() {
  return date.GetDates(date.GetFromDateNow(), date.GetEndDateNow()).map((d) => [{ text: d.toDateString(), callback_data: `date-now-${d.getTime()}` }]);
}

async function Command(ctx) {
    logger.debug('Commands: /now', { userID: ctx.chat.id });
    const now = ctx.message.text.replace(/\/now/g, '').trim();

    if (now === '') {
         await ctx.telegram.sendMessage(ctx.chat.id, 'Select your next date', {
            reply_markup: {
              inline_keyboard: getKeyboard(),
            },
          });
        return;
    }
}

module.exports = { Command };
