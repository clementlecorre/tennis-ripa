const schedule = require('node-schedule');
const logger = require('../logger/logger');
const constants = require('../helpers/const');

function Job(ctx, session) {
  // init reminder time
  session.remindertime = new Date(session.scheduletime);
  // update reminder.js time day with config
  session.remindertime.setDate(session.remindertime.getDate() - constants.ReminderDayBefore);
  // update reminder.js time hours with config
  session.remindertime.setHours(constants.ReminderTime.getHours(), constants.ReminderTime.getMinutes(), constants.ReminderTime.getSeconds());
  // start reminder job
  const jobReminder = schedule.scheduleJob(`${session.id}-reminder.js-${session.config}`, session.remindertime.toUTCString(), reminderJob.bind(this, ctx, session));
  return session;
}

function reminderJob(ctx, session) {
  ctx.telegram.sendMessage(session.userid, `🔃 Reminder your schedule job tomorrow at ${session.scheduletime.toDateString()} for ${session.reservationdate.toDateString()}`).then((r) => logger.info('Reminder job', { userID: session.userid, response: r }));
}

module.exports = {
  Job,
};
