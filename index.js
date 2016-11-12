'use strict';

let fs = require('fs');
let path = require('path');
let http = require('http');
let https = require('https');

let express = require('express');
let cors = require('cors');
let timeout = require('connect-timeout');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let responseTime = require('response-time');
let multer = require('multer');
let compression = require('compression');
let errorHandler = require('api-error-handler');

let app = express();

let isFunction = (fn) => typeof fn === 'function';

let validOptions = (options) => {
  if (!options) {
    throw 'Must provider options param.';
  }
  let port = + options.port;
  if (port <= 0 || port > 65535) {
    throw 'Must provider valid port:[0-65535]';
  }
  if (!options.routesPath || !fs.existsSync(options.routesPath)) {
    throw 'Must provider exists routes path.';
  }
};

let loadMiddleware = (options) => {
  // Add response time support, show detail: https://github.com/expressjs/response-time
  if (options.enableResponseTime) {
    let responseTimeOpt = options.responseTimeOptions || {};
    app.use(responseTime(responseTimeOpt));
    console.log('Enable response time.');
  }

  // Add morgan support, show detail: https://github.com/expressjs/morgan
  if (options.enableLog) {
    let logFormat = options.logFormat || 'combined';
    let logOptions = options.logOptions || {};
    app.use(morgan(logFormat, logOptions));
    console.log('Enable morgan log.');
  }

  // Add cors support, show detail: https://github.com/expressjs/cors
  if (options.enableCors) {
    let corsOptions = options.corsOptions || {};
    app.use(cors(corsOptions));
    console.log('Enable cors.');
  }
  // Add body-parser support, show detail: https://github.com/expressjs/body-parser
  let urlParserOptions = options.userParserOptions || { limit: '10mb', extended: false };
  app.use(bodyParser.urlencoded(urlParserOptions));
  let jsonParserOptions = options.jsonParserOptions || { limit: '10mb' };
  app.use(bodyParser.json(jsonParserOptions));

  // Add gzip support, show detail: https://github.com/expressjs/compression
  if (options.enableGzip) {
    let gzipOptions = options.gzipOptions || {};
    app.use(compression(gzipOptions));
    console.log('Enable gzip.');
  }
};

let onRoutesLoading = (options) => {
  if (isFunction(options.onRoutesLoading)) {
    options.onRoutesLoading(app);
  }
};

let loadRoutes = (options) => {
  let routeArr = [];
  //加载配置的路由目录下的JS文件。
  fs.readdirSync(options.routesPath)
    .forEach(item => {
      let filePath = path.join(options.routesPath, item);
      let stat = fs.statSync(filePath);
      if (stat.isFile() && /\.js$/.test(filePath)) {
        routeArr.push(require(filePath));
      }
    });
  //根据优先级排序
  routeArr.sort((a1, a2) => (a2.priority || 0) - (a1.priority || 0));
  let routeCounter = 0;
  routeArr.forEach(r => {
    if (r.router) {
      let prefix = `${options.apiPrefix || '/'}${r.prefix || '/'}`.replace(/\/\//g, '/');
      app.use(prefix, r.router);
      routeCounter++;
    }
  });
  console.log(`Loaded ${routeCounter} routers.`);
};

let onRoutesLoaded = (options) => {
  if (isFunction(options.onRoutesLoaded)) {
    options.onRoutesLoaded(app);
  }
  app.use(errorHandler());
};

let runServer = (options) => {
  let server;
  if (options.enableHttps === true) {
    let httpsOptions = options.httpsOptions || {
      key: fs.readFileSync(path.join(__dirname, 'keys', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'keys', 'cert.pem'))
    };
    server = https.createServer(httpsOptions, app);
  } else {
    server = http.createServer(app);
  }
  return new Promise((resolve, reject) => {
    server.listen(options.port, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(server);
    });
  });
};

let startServer = (options, done) => {
  global.Router = express.Router;
  validOptions(options);
  loadMiddleware(options);
  onRoutesLoading(options);
  loadRoutes(options);
  onRoutesLoaded(options);
  return runServer(options);
};

// 捕获未处理的异常
process.on('uncaughtException', function (err) {
  console.error(err);
});

module.exports = {
  MSSQL: require('./lib/dbProviders/MSSQL'),
  MYSQL: require('./lib/dbProviders/MYSQL'),
  startServer: startServer
};
