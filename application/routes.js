/*
These are routes as defined in https://slidewiki.atlassian.net/wiki/display/SWIK/API+Calls
Each route implementes a basic parameter/payload validation and a swagger API documentation description
*/
'use strict';

const Joi = require('joi'),
  handlers = require('./controllers/handler');

// const DEFAULT_OPTIONS = {
//   abortEarly: false,
//   stripUnknown: { objects: true }
// };

const choiceSchema =
  Joi.object({
    choice: Joi.string().min(1).required(),
    is_correct: Joi.boolean().required()
  });

module.exports = function(server) {

  //Get all the questions
  server.route({
    method: 'GET',
    path: '/questions',
    handler: handlers.getAllQuestions,
    config: {
      validate: {
        params: {
        },
      },
      tags: ['api'],
      description: 'Get all questions'
    }
  });

  //Alter is_exam_question for received ids
  server.route({
    method: 'PUT',
    path: '/questions/updateExamList',
    handler: handlers.updateExamList,
    config: {
      validate: {
        payload: Joi.array().items(Joi.object().keys({
          id: Joi.number().integer().description('id of the question to alter is_exam_question'),
          is_exam_question: Joi.boolean(),
        }))
      },
      tags: ['api'],
      description: 'Alter is_exam_question params'
    }
  });

  //Get question with id from database and return it (when not available, return NOT FOUND). Validate id
  server.route({
    method: 'GET',
    path: '/question/{id}',
    handler: handlers.getQuestion,
    config: {
      validate: {
        params: {
          id: Joi.string().regex(/^\d+$/)
          // id: Joi.string().alphanum().min(1).max(24)
          // id: Joi.number().integer()
        },
      },
      tags: ['api'],
      description: 'Get a question by id'
    }
  });

  //Create new question (by payload) and return it (...). Validate payload
  server.route({
    method: 'POST',
    path: '/{related_object}/question',
    handler: handlers.newQuestion,
    config: {
      validate: {
        params: {
          related_object: Joi.string().valid(['slide','deck']),
        },
        payload: Joi.object().keys({
          related_object_id: Joi.string().alphanum().min(1).max(24),
          question: Joi.string(),
          user_id: Joi.string().alphanum().min(1).max(24),
          difficulty: Joi.number().integer().min(1).max(5),
          is_exam_question: Joi.boolean(),
          explanation: Joi.string().allow(''),
          choices: Joi.array().items(choiceSchema).required().min(0).max(4)
        }).requiredKeys('related_object_id', 'question', 'user_id', 'choices'),
      },
      tags: ['api'],
      description: 'Create a new question'
    }
  });

  //Update question with id id (by payload) and return it (...). Validate payload
  server.route({
    method: 'PUT',
    path: '/question/{id}',
    handler: handlers.replaceQuestion,
    config: {
      validate: {
        params: {
          id: Joi.string().regex(/^\d+$/)
        },
        payload: Joi.object().keys({
          related_object: Joi.string().valid(['slide','deck']),
          related_object_id: Joi.string().alphanum().min(1).max(24),
          question: Joi.string(),
          user_id: Joi.string().alphanum().min(1).max(24),
          difficulty: Joi.number().integer().min(1).max(5),
          is_exam_question: Joi.boolean(),
          explanation: Joi.string().allow(''),
          choices: Joi.array().items(choiceSchema).required() .min(0).max(4)
        }).requiredKeys('related_object', 'related_object_id', 'question', 'user_id', 'choices'),
      },
      tags: ['api'],
      description: 'Replace a question by id'
    }
  });

  //Get all questions of Deck or Slide with its id and return it (...).
  server.route({
    method: 'GET',
    path: '/{related_object}/{related_object_id}/questions',
    handler: handlers.getRelatedQuestions,
    config: {
      validate: {
        params: {
          related_object: Joi.string().valid(['slide','deck']),
          related_object_id: Joi.string().alphanum().min(1).max(24)
        },
        query: {
          metaonly: Joi.string().description('Set to true to return only metadata without the list of questions'),
          include_subdecks_and_slides: Joi.string().description('Set to true to include activities of subdecks and slides'),
          exam_questions_only: Joi.string().description('Set to true to include only exam questions'),
          non_exam_questions_only: Joi.string().description('Set to true to include only non exam questions')
        }
      },
      tags: ['api'],
      description: 'Get all the questions of a deck with Id deck-id'
    }
  });


  //Delete a question with id id and return it (...).
  server.route({
    method: 'DELETE',
    path: '/question/{id}',
    handler: handlers.deleteQuestion,
    config: {
      validate: {
        params: {
          // id: Joi.string().alphanum().min(1).max(24)
          id: Joi.string().regex(/^\d+$/)
        }
      },
      tags: ['api'],
      description: 'Delete a question by its id'
    }
  });
};
