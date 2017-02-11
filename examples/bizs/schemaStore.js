const Joi = require('joi');

const TEST_SCHEMA = Joi.object().keys({
  key1: Joi.string().required().description('test').example('aa'),
  key2: Joi.number().greater(5).required()
});

module.exports = {
  TEST_SCHEMA
};
