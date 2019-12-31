const csvParse = require('csv-parse');

const mongoClient = require('./db.js');

function parseCsv(csv) {
  return new Promise((resolve, reject) => {
    csvParse(csv, { columns: true }, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
}

module.exports = async req => {
  try {
    const { customClass, csvData } = req.params;

    if (!customClass || !customClass.name || !customClass.schema || !csvData) {
      return {
        success: false,
        message: 'Class name, schema and csv data are required'
      };
    }

    const data = await parseCsv(csvData);

    const schema = new Parse.Schema(customClass.name);

    for (const [name, type] of Object.entries(customClass.schema)) {
      schema.addField(name, type);
    }

    await schema.save();

    const connection = await mongoClient.connect();
    const newCollection = connection.db().collection(customClass.name);

    const { result } = await newCollection.insertMany(data);

    console.log('Successfully inserted documents');

    return { success: true, docsImported: result.n };
  } catch (err) {
    console.log(err);
    return { success: false, ...err, message: err.message };
  } finally {
    mongoClient.close();
  }
};
