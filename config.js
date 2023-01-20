const { env } = process;

const config = {
  db: {
    host: env.DB_HOST || 'localhost',
    port: env.DB_PORT || '5432',
    user: env.DB_USER || 'user',
    password: env.DB_PASSWORD,
    database: env.DB_NAME || 'db',
  },
  listPerPage: env.LIST_PER_PAGE || 10,
  telegram: {
    token: env.TELEGRAM_TOKEN,
  },
  tennis: {
    account: {
      username: env.TENNIS_USERNAME,
      password: env.TENNIS_PASSWORD,
    },
  },
};

module.exports = config;
