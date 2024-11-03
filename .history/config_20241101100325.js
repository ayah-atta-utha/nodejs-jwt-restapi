// config.js
const config = {
  PORT: process.env.PORT || 3000, // Default port if not set
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'your_db_user',
    PASSWORD: process.env.DB_PASSWORD || 'your_db_password',
    NAME: process.env.DB_NAME || 'your_db_name',
    PORT: process.env.DB_PORT || 5432 // Default PostgreSQL port
  }
};

module.exports = config;
