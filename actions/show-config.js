const logger = require('../logger/logger');

async function Action(ctx) {
  const dateRaw = ctx.callbackQuery.data;
  let configfile = dateRaw.replace(/show-config-/g, '');
  logger.info('Action show config', { userID: ctx.chat.id, configfile });
  const config = require(`../preset-config/${configfile}`)
  ctx.reply(`
Config name: ${config.name}\n
Locations: ${config.locations}\n
Hours: ${config.hours}\n
PriceType: ${config.priceType}\n
CourtType: ${config.courtType}\n`)

}
module.exports = { Action };
