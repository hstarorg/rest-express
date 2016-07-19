# rest-express
A rest api framework based on express.

[![NPM Version](https://img.shields.io/npm/v/rest-express.svg?style=flat)](https://www.npmjs.org/package/rest-express)
[![npm](https://img.shields.io/npm/dm/rest-express.svg?style=flat)](https://www.npmjs.org/package/rest-express)
[![npm](https://img.shields.io/npm/dt/rest-express.svg?style=flat)](https://www.npmjs.org/package/rest-express)
[![Build Status](https://travis-ci.org/hstarorg/rest-express.svg?branch=master)](https://travis-ci.org/hstarorg/rest-express)
[![Coverage Status](https://coveralls.io/repos/hstarorg/rest-express/badge.svg?branch=master)](https://coveralls.io/r/hstarorg/rest-express?branch=master)
[![Dependency Status](https://david-dm.org/hstarorg/rest-express.svg?style=flat)](https://david-dm.org/hstarorg/rest-express)
[![License](http://img.shields.io/npm/l/rest-express.svg?style=flat)](https://raw.githubusercontent.com/hstarorg/rest-express/master/LICENSE)

# How to use?

``$ npm install rest-express --save``

```javascript
let restExpress = require('rest-express');
restExpress.startServer(options)
  .then((server) => {
    let address = server.address();
    console.log('Server started', address);
  }, (err) => {
    console.error(err);
  });
```
# About Options

```javascript
let options = {
  port: 3000, //必须提供，服务端口
  enableResponseTime: true, //是否启用响应时间记录（会在header中，设置X-Response-Time的值，单位毫秒）
  responseTimeOptions: { //responseTime的参数配置，请参考：https://github.com/expressjs/response-time
    digits: 4, //default 3
    header: 'use-time',
    suffix: false
  },
  enableLog: true, //是否启用日志
  logFormat: 'combined', //设置日志格式
  logOptions: { //日志插件相关参数，请参考：https://github.com/expressjs/morgan

  },
  enableCors: true, //是否启用Cors支持
  corsOptions: { //Cors参数，请参考：https://github.com/expressjs/cors

  },
  urlParserOptions: {}, //转换url参数配置，请参考：https://github.com/expressjs/body-parser
  jsonParserOptions: {}, //转换json参数配置，请参考：https://github.com/expressjs/body-parser
  enableGzip: true, //是否启用Gzip支持
  gzipOptions: {}, //gzip配置，请参考：https://github.com/expressjs/compression
  enableHttps: false, //是否启用Https
  httpsOptions: { //Https配置项，提供{key: '', cert: ''}
    key: '',
    cert: ''
  },
  onRoutesLoading: (app) => { //加载路由之前要执行的操作，参数app = express();
    console.log('before load routes');
  },
  onRoutesLoaded: (app) => { //加载路由之后要执行的操作，参数app = express();
    console.log('after load routes');
  },
  routesPath: path.join(__dirname, 'routes'), //路由目录，所有要加载的路由都放置在此处。
  apiPrefix: '/' //全局Api前缀， 如： /api/v1
};
```

**注意：其中 ``port`` 和 ``routesPath`` 为必填参数。**

# How to write route?

```javascript
'use strict';

let router = new Router();
let testBiz = require('./../bizs/testBiz');

router.get('/test', testBiz.test);

//每个路由文件需要如下方式导出：
module.exports = {
  priority: 0, // 可选参数，默认0，优先级，越大越先加载
  router: router, // 必须参数，router对象。
  prefix: '/test/abc' // 可选参数，默认/，router前缀，会拼接在options.apiPrefix之后。
};
```

# How to use MSSQL?

```javascript
let MSSQL = require('rest-express').MSSQL;

let config = {
  user: 'xxx', // UserName
  password: 'xxxx', // Password
  server: '127.0.0.1', // Server Name(IP)
  port: 1433, // Data Server Port 
  database: 'XXX', // Data base name
  pool: { //线程池
    max: 50, // 最大线程数
    min: 0, // 最小线程数
    idleTimeoutMillis: 30 * 1000 // 超时时间
  }
};
let db = new MSSQL(config);

db.executeNonQuery('update JayTestTable1 set password = @pwd', {pwd: '中文'})
  .then((count) => {
    console.log(count); //受影响的行数
  });
db.executeScalar('select top 1 * from JayTestTable1 where id = 15')
  .then((data) => {
    console.log(data); //查询结果的第一行数据（建议查询语句只会有第一行数据）
    //如果查询结果是一个简单数据，如查询count，那么data则直接是这个count值，不在是一个对象。
  });
db.executeQuery('select * from JayTestTable1')
  .then((rows) => {
    console.log(rows); //数据集
  });
db.executeProcedure('up_GetPersonalApiList', {userName: 'abc'}, {}) //存储过程名称、输入参数、输出参数
  .then((result) => {
    console.log(result.result); //执行结果
    console.log(result.affectedRowCount); //受影响的行数
    console.log(result.resultOutput); // 输出参数
  });
```
