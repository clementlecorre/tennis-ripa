const schedule = require('node-schedule');
const constants = require('../helpers/const');
const logger = require('../logger/logger');
const tennis = require('../headless/index');
const database = require('../database/config/index');

function Job(ctx, session) {
  // init schedule time
  session.scheduletime = new Date(session.reservationdate);
  // update schedule time day with preset-config
  session.scheduletime.setDate(session.scheduletime.getDate() - constants.ScheduleTimeBeforeReservation);
  // update schedule time hours with preset-config
  session.scheduletime.setHours(constants.ScheduleTime.getHours(), constants.ScheduleTime.getMinutes(), constants.ScheduleTime.getSeconds(), constants.ScheduleTime.getMilliseconds());
  // start schedule job
  const job = schedule.scheduleJob(`${session.id}-booking-${session.config}`, session.scheduletime.toUTCString(), jobBooking.bind(this, ctx, session));
  return session;
}

async function jobBooking(ctx, session) {
  logger.info('Schedule job', { userID: session.id, session });
  let bookTennis = '';
  let isErrored = false;
  let emoji = constants.EmojiSuccess;
  let filename = constants.ScreenshotSuccessName;
  try {
    bookTennis = await tennis.bookTennis(`../preset-config/${session.config}`, session.reservationdate);
    logger.info('Schedule job (book tennis)', { userID: session.id, bookTennis });
  } catch (e) {
    logger.warn('Schedule job (book tennis): error', { userID: session.id, error: e });
    isErrored = true;
    bookTennis += e;
    emoji = constants.EmojiFatal;
    filename = constants.ScreenshotFailureName;
  }
  const response = await database.update.finishConfig({
    id: session.id,
    details: bookTennis,
  }, isErrored);
  logger.info('Schedule job (finish config)', { userID: session.id, response });
  if (typeof bookTennis === 'undefined') {
    emoji = constants.EmojiError;
  }
  ctx.telegram.sendMessage(session.userid, `${emoji} Job finished\n${bookTennis}`).then((r) => logger.info('Schedule job (send message)', { userID: session.id, response: r }));
  if (typeof bookTennis !== 'undefined') {
    try {
      await ctx.telegram.sendDocument(session.userid, { source: filename });
    } catch (e) {
      logger.warn('Schedule job (send document): error', { userID: session.id, error: e });
    }
    logger.info('Schedule job (send screenshot)', { userID: session.id, response });
  }
}

module.exports = {
  Job,
  jobBooking,
};
