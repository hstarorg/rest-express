'use strict';

let config = {
  user: 'acctdbo',
  password: '4Acct2Dev',
  server: '10.1.25.28',
  port: 41433,
  database: 'APIPortal',
  pool: {
    max: 50,
    min: 0,
    idleTimeoutMillis: 30 * 1000
  }
};

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
    })
    .catch(console.error);
};

module.exports = {
  test: test,
  dbtest1: dbtest1
};