const files = require('../helpers/files');

function getKeyboard() {
  return files.GetConfig().map((c) => [{ text: c.name, callback_data: `show-config-${c.fileName}` }]);
}
async function Command(ctx) {
 const response = await ctx.telegram.sendMessage(ctx.chat.id, 'Choose your tennis config:', {
    reply_markup: {
      inline_keyboard: getKeyboard(),
    },
  });
}

module.exports = { Command };
