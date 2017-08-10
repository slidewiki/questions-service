/**
 * Created by lfernandes on 01.06.17.
 */
/**
 * Created by lfernandes on 01.06.17.
 */
'use strict';

//require
let Ajv = require('ajv');
let ajv = Ajv({
  verbose: true,
  allErrors: true
}); // options can be passed, e.g. {allErrors: true}

//build schema
const choice = {
  type: 'object',
  properties: {
    _id: {
      type: 'number'
    },
    choice: {
      type: 'string'
    },
    is_correct: {
      type: 'boolean' //TODO check lowercase
    },
    explanation: {
      type: 'string'
    }
  },
  required: ['_id', 'choice', 'is_correct']
};

//export
module.exports = ajv.compile(choice);
