const database = require('../database/config/index');
const constants = require('../helpers/const');
const logger = require('../logger/logger');
const jobs = require('../jobs');

async function Action(ctx) {
  logger.info('Action select config', { action: ctx.callbackQuery.data, userID: ctx.chat.id });
  const configNameRaw = ctx.callbackQuery.data;
  let configName = configNameRaw.replace(/config-/g, '');
  if (configNameRaw.includes('now-')) {
    configName = configNameRaw.replace(/config-now-/g, '');
  }
  logger.info('Action select date (parse config name)', { userID: ctx.chat.id, configName });
  ctx.reply(`Your config is: ${configName}`);
  // get last session
  const sessions = await database.get.lastSession();
  logger.info('Action select date (get last session)', { userID: ctx.chat.id, sessions });
  if (sessions.length !== 1) {
    logger.info('Action select date (get last session): expired', { userID: ctx.chat.id, sessions });
    ctx.reply(`Your reservation is delayed by more than ${constants.TelegramSessionMinutes} mins, please try again with /add command`);
    return;
  }
  let session = sessions[0];
  session.startsession = new Date(session.startsession);
  session.reservationdate = new Date(session.reservationdate);
  session.remindertime = new Date();
  session.config = configName;

  if (configNameRaw.includes('now-')) {
    session.remindertime = new Date();
    await jobs.schedule.jobBooking(ctx, session);
    session.scheduletime = new Date()
  } else {
    session = jobs.schedule.Job(ctx, session);
    session = jobs.reminder.Job(ctx, session);
    // send message to user
    ctx.telegram.sendMessage(session.userid, `🚀 Schedule job at ${session.scheduletime.toDateString()} ${session.scheduletime.toTimeString()} for ${session.reservationdate.toTimeString()}`).then((r) => logger.info('reminder (send message)', { userID: ctx.chat.id, response: r }));
    ctx.telegram.sendMessage(session.userid, `🔃 Reminder job at ${session.remindertime.toDateString()} ${session.remindertime.toTimeString()}`).then((r) => logger.info('schedule (send message)', { userID: ctx.chat.id, response: r }));
  }

  const response = await database.update.finalizeConfig(
    {
      id: session.id,
      config: session.config,
      scheduleTime: session.scheduletime.toUTCString(),
      endSession: new Date(),
    },
  );
  logger.info('Action select date (finalize config)', { userID: ctx.chat.id, response });
}
module.exports = { Action };
