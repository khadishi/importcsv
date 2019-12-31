const { MongoClient } = require('mongodb');

const keys = require('./keys');

module.exports = new MongoClient(keys.mongoUri, {
  useUnifiedTopology: true,
  auth: {
    user: keys.mongoUsername,
    password: keys.mongoPassword
  }
});
