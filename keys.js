module.exports = {
  mongoUri:
    process.env.PARSE_SERVER_DATABASE_URI || 'mongodb://localhost:27017',
  mongoUsername: process.env.PARSE_SERVER_DATABASE_USERNAME || 'root',
  mongoPassword: process.env.PARSE_SERVER_DATABASE_PASSWORD || 'password'
};
