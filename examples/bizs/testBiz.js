'use strict';

const config = require('./../config').dbConfig;
const MSSQL = require('./../../index').MSSQL;
const schemaStore = require('./schemaStore');

let db = new MSSQL(config);

let test = (req, res, next) => {
  Validator.validate(req.body, schemaStore.TEST_SCHEMA)
    .then(() => {
      res.json('abc, from biz.');
    })
    .catch(next);
};

let dbtest1 = (req, res, next) => {
  // db.executeNonQuery('update JayTestTable1 set password = @pwd', {pwd: '中文'})
  // db.executeScalar('select top 1 * from JayTestTable1 where id = 15')
  // db.executeQuery('select * from JayTestTable1')
  db.executeScalar('select abc = count(0) from JayTestTable1')
    .then((data) => {
      res.json(data);
      db.close
    })
    .catch(console.error);
};

let dbtest2 = (req, res, next) => {
  db.executeProcedure('up_GetPersonalApiList', { UserId: 'jh3r' })
    .then((data) => {
      res.json(data);
    })
    .catch(console.error);
};


// let dbtest3 = (req, res, next) => {
//   let tran = db.newTransaction();
//   tran.begin((err) => {
//     db.executeProcedure('up_GetPersonalApiList', { UserId: 'jh3r' }, tran)
//       .then((data) => {
//         res.json(data);
//       })
//       .catch(console.error);
//     db.executeNonQuery('update xxx')
//     tran.com
//   });
// };

db.newTransaction((tran) => db.executeProcedure('up_GetPersonalApiList', { UserId: 'jh3r' }, tran))


module.exports = {
  test,
  dbtest1,
  dbtest2
};
