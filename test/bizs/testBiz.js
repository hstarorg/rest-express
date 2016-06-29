'use strict';

let test = (req, res) => {
  res.json('abc, from biz.');
};

module.exports = {
  test: test
};