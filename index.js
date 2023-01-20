const { Telegraf } = require('telegraf');

// commands
const commands = require('./commands/index');
const constants = require('./helpers/const');

// actions
const dateActions = require('./actions/date');
const configActions = require('./actions/config');
const showConfigActions = require('./actions/show-config');
const config = require('./config');
const logger = require('./logger/logger');

const database = require('./database/config/index');
const jobs = require('./jobs/index');

const bot = new Telegraf(config.telegram.token);

bot.command('start', (ctx) => {
  commands.start.Command(ctx);
});

bot.command('help', (ctx) => {
  commands.help.Command(ctx);
});

bot.command('add', (ctx) => {
  if (ctx.chat.id === constants.AdminID) {
    commands.add.Command(ctx);
  } else {
    ctx.reply(constants.NotAdminMessage);
    logger.info('User ID: is not admin', {
      userID: ctx.chat.id, username: ctx.chat.username, last_name: ctx.chat.last_name, first_name: ctx.chat.first_name,
    });
  }
});

bot.command('now', (ctx) => {
  if (ctx.chat.id === constants.AdminID) {
    commands.now.Command(ctx);
  } else {
    ctx.reply(constants.NotAdminMessage);
    logger.info('User ID: is not admin', {
      userID: ctx.chat.id, username: ctx.chat.username, last_name: ctx.chat.last_name, first_name: ctx.chat.first_name,
    });
  }
});



bot.command('remove', (ctx) => {
  if (ctx.chat.id === constants.AdminID) {
    commands.remove.Command(ctx);
  } else {
    ctx.reply(constants.NotAdminMessage);
  }
});

bot.command('list', (ctx) => {
  if (ctx.chat.id === constants.AdminID) {
    commands.list.Command(ctx);
  } else {
    ctx.reply(constants.NotAdminMessage);
  }
});

bot.command('showconfig', (ctx) => {
  if (ctx.chat.id === constants.AdminID) {
    commands.showConfig.Command(ctx);
  } else {
    ctx.reply(constants.NotAdminMessage);
  }
});

bot.action(/show-config-(.*)/, (ctx) => {
  if (ctx.chat.id === constants.AdminID) {
    showConfigActions.Action(ctx);
  } else {
    ctx.reply(constants.NotAdminMessage);
  }
});

bot.action(/date-(.*)/, (ctx) => {
  if (ctx.chat.id === constants.AdminID) {
    dateActions.Action(ctx);
  } else {
    ctx.reply(constants.NotAdminMessage);
  }
});

bot.action(/config-(.*)/, (ctx) => {
  if (ctx.chat.id === constants.AdminID) {
    configActions.Action(ctx);
  } else {
    ctx.reply(constants.NotAdminMessage);
  }
});

logger.info('Bot is starting....');
bot.launch().then((r) => {
  logger.info('Bot is started');
  database.get.jobToSchedule().then((sessions) => {
    if (sessions.length > 0) {
      sessions.forEach((session) => {
        logger.info('re-schedule', { session });
        session = jobs.schedule.Job(bot, session);
        jobs.reminder.Job(bot, session);
      });
    }
  });
});
