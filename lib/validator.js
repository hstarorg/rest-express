'use strict';
const Joi = require('joi');

const validate = (data, schema, options = { allowUnknown: true, abortEarly: false }) => {
  return new Promise((resolve, reject) => {
    Joi.validate(data, schema, options, (err, value) => {
      if (err) {
        return reject(err);
      }
      resolve(value);
    });
  });
};

module.exports = {
  validate
};
