'use strict';

let config = require('./../config').dbConfig;

let MSSQL = require('./../../index').MSSQL;

let db = new MSSQL(config);

let test = (req, res) => {
  res.json('abc, from biz.');
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

db.useTransaction((tran) => db.executeProcedure('up_GetPersonalApiList', { UserId: 'jh3r' }, tran))


module.exports = {
  test: test,
  dbtest1: dbtest1,
  dbtest2: dbtest2
};