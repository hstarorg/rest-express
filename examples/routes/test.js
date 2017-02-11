'use strict';

let router = new Router();
let testBiz = require('./../bizs/testBiz');

router.get('/test', testBiz.test);

router.get('/dbtest1', testBiz.dbtest1);

router.get('/dbtest2', testBiz.dbtest2);

module.exports = {
  priority: 0,
  router: router,
  prefix: '/test/abc'
};