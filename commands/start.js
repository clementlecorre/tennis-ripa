function Command(ctx) {
  const message = `
Hello! Welcome to Tennis Paris bot :)
/add - Add a new reservation tennis court
/remove - Remove reservation a tennis court
/list - List all reservation tennis courts
/help - Help
`;
  ctx.reply(message);
}
module.exports = { Command };
