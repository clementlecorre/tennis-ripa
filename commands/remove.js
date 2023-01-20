const schedule = require('node-schedule');
const database = require('../database/config/index');
const logger = require('../logger/logger');

async function Command(ctx) {
  const id = ctx.message.text.replace(/\/remove/g, '').trim();
  if (id === '') {
    ctx.reply('Please enter id /remove <id>');
    return;
  }
  const response = await database.update.unsetScheduling(id);
  let found = false;
  logger.debug('update scheduling', { response });
  const jobList = schedule.scheduledJobs;
  Object.keys(jobList).forEach((jobName) => {
    if (jobName.startsWith(id)) {
      found = true;
      logger.info('remove job', { job: jobName, userID: ctx.chat.id });
      jobList[jobName].cancel();
      ctx.reply(`Remove job ${jobName}`);
    }
  });
  if (!found) {
    ctx.reply('Job not found');
  }
}

module.exports = { Command };
