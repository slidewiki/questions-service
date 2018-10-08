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
const objectid = {
  type: 'string',
  maxLength: 24,
  minLength: 1
};

const question = {
  type: 'object',
  properties: {

    _id: {
      type: 'integer',
      maxLength: 24,
      minLength: 1
    },
    related_object: {   // "deck" / "slide" / ... (?)
      type: 'string'
    },
    related_object_id: objectid,
    question: {
      type: 'string'
    },
    user_id: {
      type: 'string' //TODO check lowercase
    },
    explanation: {
      type: 'string'
    },
    choices: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: objectid,
          choice: {
            type: 'string'
          },
          is_correct: {
            type: 'boolean' //TODO check lowercase
          }
        }
      }
    },
    difficulty: {
      type: 'number',
      minimum: 1,
      maximum: 5
    },
    is_exam_question: {
      type: 'boolean'
    }
  },
  required: ['_id', 'related_object', 'related_object_id', 'question', 'user_id', 'choices']
};

//export
module.exports = ajv.compile(question);
