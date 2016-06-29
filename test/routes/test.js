'use strict';

let router = new Router();
let testBiz = require('./../bizs/testBiz');

router.get('/test', testBiz.test);

module.exports = {
  priority: 0,
  router: router,
  prefix: '/test/abc'
};