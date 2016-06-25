'use strict';

let restExpress = require('./../index');

let options = {
  port: 3000,
  enableResponseTime: true,
  responseTimeOptions: {
    digits: 4, //default 3
    header: 'use-time',
    suffix: false
  },
  enableLog: true,
  logFormat: 'combined',
  logOptions: {

  },
  enableCors: true,
  corsOptions: {

  },
  urlParserOptions: {},
  jsonParserOptions: {},
  enableGzip: true,
  gzipOptions: {}
};

restExpress.startServer(options)
  .then((server) => {
    let address = server.address();
    console.log('Server started', address);
  }, (err) => {
    console.error(err);
  });