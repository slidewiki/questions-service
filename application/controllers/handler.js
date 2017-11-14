/*
Handles the requests by executing stuff and replying to the client. Uses promises to get stuff done.
*/
/* eslint promise/always-return: "off" */

'use strict';

const boom = require('boom'), //Boom gives us some predefined http codes and proper responses
  questionDB = require('../database/questionDatabase'), //Database functions specific for questions
  co = require('../common');

module.exports = {

  //Get all questions from database or return NOT FOUND if the collection is empty 
  getAllQuestions: function(request, reply) {
    questionDB.getAll().then((questions) => {

      questions.forEach((question) => {
        co.rewriteID(question);
      });

      let jsonReply = JSON.stringify(questions);
      reply(jsonReply);

    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });

  },

  //Get a question from database or return NOT FOUND 
  getQuestion: function(request, reply) {
    questionDB.get(request.params.id).then((question) => {
      if (co.isEmpty(question))
        reply(boom.notFound());
      else
        reply(co.rewriteID(question));
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Get a question from database or return NOT FOUND 
  getRelatedQuestions: function(request, reply) {
    questionDB.getAllRelated(request.params.related_object,
      request.params.related_object_id
    ).then((question) => {
      if (co.isEmpty(question))
        reply(boom.notFound());
      else
        reply(co.rewriteID(question));
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },


  //Create Question with new id and payload or return INTERNAL_SERVER_ERROR
  newQuestion: function(request, reply) {
    questionDB.insert(Object.assign({'related_object':request.params.related_object},request.payload)).then((inserted) => {
      if (co.isEmpty(inserted))
        throw inserted;
      else
        reply(co.rewriteID(inserted));
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  // replace an existing question
  replaceQuestion: function(request, reply) {
    questionDB.replace(request.params.id, request.payload).then((replaced) => {
      if (co.isEmpty(replaced.value)){
        reply(boom.notFound());
      }
      else{
        reply(co.rewriteID(replaced.value));
      }
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Create Question with new id and payload or return INTERNAL_SERVER_ERROR
  deleteQuestion: function(request, reply) {
    questionDB.remove(request.params.id).then((deleted) => {
      if (co.isEmpty(deleted))
        reply(co.rewriteID(deleted));
      else
        reply(boom.notFound());
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

};
