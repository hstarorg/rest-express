'use strict';

const path = require('path');
const restExpress = require('./../index');

const options = {
  port: 3000,
  enableResponseTime: true,
  responseTimeOptions: {
    digits: 4, //default 3
    // header: 'use-time',
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
  enableHttps: false,
  httpsOptions: {

  },
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
