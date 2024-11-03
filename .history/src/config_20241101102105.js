// config.js
export const config = {
  PORT: process.env.PORT || 3000, // Default port if not set
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'news_user',
    PASSWORD: process.env.DB_PASSWORD || 'news123',
    NAME: process.env.DB_NAME || 'news_api',
    PORT: Number(process.env.DB_PORT) || 5432 // Default PostgreSQL port
  }
};

  export  default config;
