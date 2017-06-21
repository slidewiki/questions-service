/*
These are routes as defined in https://slidewiki.atlassian.net/wiki/display/SWIK/API+Calls
Each route implementes a basic parameter/payload validation and a swagger API documentation description
*/
'use strict';

const Joi = require('joi'),
  handlers = require('./controllers/handler');

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

  //Get question with id from database and return it (when not available, return NOT FOUND). Validate id
  server.route({
    method: 'GET',
    path: '/question/{id}',
    handler: handlers.getQuestion,
    config: {
      validate: {
        params: {
          id: Joi.string().alphanum().lowercase()
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
          related_object: Joi.string().valid(['slide','deck']),
          related_object_id: Joi.string().alphanum(),
          question: Joi.string(),
          user_id: Joi.string().alphanum().lowercase(),
          difficulty: Joi.number().integer().min(1).max(5),
          choices: Joi.array().min(0).max(4)
        }).requiredKeys('related_object', 'related_object_id', 'question', 'user_id', 'choices'),
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
          id: Joi.string().alphanum().lowercase()
        },
        payload: Joi.object().keys({
          related_object: Joi.string().valid(['slide','deck']),
          related_object_id: Joi.string().alphanum(),
          question: Joi.string(),
          user_id: Joi.string().alphanum().lowercase(),
          difficulty: Joi.number().integer().min(1).max(5),
          choices: Joi.array().min(0).max(4)
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
          related_object_id: Joi.string().alphanum(),
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
          id: Joi.string().alphanum().lowercase()
        }
      },
      tags: ['api'],
      description: 'Delete a question by id'
    }
  });
};
