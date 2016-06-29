'use strict';

let path = require('path');
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
  gzipOptions: {},
  onRoutesLoading: (app) => {
    console.log('before load routes');
  },
  onRoutesLoaded: (app) => {
    console.log('after load routes');
  },
  routesPath: path.join(__dirname, 'routes'),
  apiPrefix: '/'
};

restExpress.startServer(options)
  .then((server) => {
    let address = server.address();
    console.log('Server started', address);
  }, (err) => {
    console.error(err);
  });