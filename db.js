const { MongoClient } = require('mongodb');

class MongoDBClient {
  constructor() {
    if (MongoDBClient.instance) {
      return MongoDBClient.instance;
    }

    MongoDBClient.instance = this;
  }

  async connect() {
    try {
      const connection = await new MongoClient(
        process.env.PARSE_SERVER_DATABASE_URI,
        {
          useUnifiedTopology: true,
          auth: {
            user: process.env.PARSE_SERVER_DATABASE_USERNAME,
            password: process.env.PARSE_SERVER_DATABASE_PASSWORD
          }
        }
      ).connect();

      this.db = connection.db();
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = MongoDBClient;
