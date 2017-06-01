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
const question = {
    type: 'object',
    properties: {
        _id: {
            type: 'number'
        },
        related_object: {   // "deck" / "slide" / ... (?)
            type: 'string'
        },
        related_object_id: {   // id of the related object
            type: 'number'
        },
        question: {
            type: 'string'
        },
        user_id: {
            type: 'string' //TODO check lowercase
        },
        choices: {
            type: 'array',
            items: {
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
                }
            }
        },
        difficulty: {
            type: 'number',
            minimum: 1,
            maximum: 5
        }
    },
    required: ['_id', 'related_object', 'related_object_id', 'question', 'user_id', 'choices']
};

//export
module.exports = ajv.compile(question);
