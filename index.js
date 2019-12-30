const csvParse = require('csv-parse');

const MongoDBClient = require('./db.js');

const mongoDBClient = new MongoDBClient();

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

Parse.Cloud.define('importcsv', async req => {
  try {
    const { customClass, csvData } = req.params;
    console.log(req.params);

    if (!customClass.name || !customClass.schema || !csvData) {
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

    const newCollection = mongoDBClient.db.collection(customClass.name);
    const { result } = await newCollection.insertMany(data);

    console.log('Successfully inserted documents');

    return { success: true, docsImported: result.n };
  } catch (err) {
    console.log(err);
    return { success: false, ...err, message: err.message };
  }
});

Parse.Cloud.define('parseimport', async req => {
  try {
    const { customClassName, csvData } = req.params;

    const data = await parseCsv(csvData);

    const CustomClass = Parse.Object.extend(customClassName);

    const customClassInstances = [];

    data.forEach(record => {
      const customClass = new CustomClass();

      for (const [column, value] of Object.entries(record)) {
        customClass.set(column, value);
      }

      customClassInstances.push(customClass.save());
    });

    await Promise.all(customClassInstances);
  } catch (err) {
    console.log(err);
    return { success: false, ...err, message: err.message };
  }
});
