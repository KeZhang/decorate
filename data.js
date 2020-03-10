const csv = require('csvtojson');
const csvFilePath = __dirname + '/装修.csv';


csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    console.table(jsonObj);
    require('fs').writeFileSync(__dirname + '/data.json', JSON.stringify(jsonObj, null, 2))
  });