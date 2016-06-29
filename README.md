# rest-express
A rest api framework based on express.

# How to use?

``$ npm install rest-express -g``

```javascript
let restExpress = require('rest-express');
restExpress.startServer(options)
  .then((err, server) => {
    if(err){
      return console.error(err);
    }
    let address = server.address();
    console.log('Server started', address);
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