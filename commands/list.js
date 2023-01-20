const schedule = require('node-schedule');
const logger = require('../logger/logger');

function Command(ctx) {
  const jobList = schedule.scheduledJobs;
  let jobMessage = '';
  logger.info('Command list: list all jobs', { userID: ctx.chat.id, jobs: jobList });
  Object.keys(jobList).forEach((jobName) => {
    jobMessage += `📅 Schedule jobs: ${jobName} at ${jobList[jobName].nextInvocation()}\n`;
  });

  if (jobMessage === '') {
    jobMessage = 'No schedule jobs';
  }
  ctx.reply(jobMessage);
}

module.exports = { Command };
