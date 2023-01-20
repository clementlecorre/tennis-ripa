const scheduleTime = new Date();
const reservationTime = new Date();
const reminderTime = new Date();
reservationTime.setHours(8, 0, 1, 0);
reminderTime.setHours(20, 0, 0, 0);
scheduleTime.setHours(reservationTime.getHours(), reservationTime.getMinutes(), reservationTime.getSeconds() - 10, reservationTime.getMilliseconds());

const telegramSessionMinutes = 5;
const startRangeDays = 7;

module.exports = Object.freeze({
  AdminID: 143428947,
  NotAdminMessage: 'You are not admin!',
  ScheduleTime: scheduleTime,
  ReservationTime: reservationTime,
  ReminderTime: reminderTime,
  ScheduleTimeBeforeReservation: 6,
  ReminderDayBefore: 1,
  TelegramSessionMinutes: telegramSessionMinutes,
  TelegramSessionMilliseconds: telegramSessionMinutes * 60 * 1000,
  StartRangeDays: startRangeDays,
  EndRangeDays: startRangeDays + 5,
  ChromeHeadless: true,
  ScreenshotFailureName: 'failure.png',
  ScreenshotSuccessName: 'success.png',
  EmojiFatal: '🤬😰❌',
  EmojiSuccess: '🎾🚀✅',
  EmojiError: '🎾🚀❌',
});
