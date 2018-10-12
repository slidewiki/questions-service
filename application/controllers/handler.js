/*
Handles the requests by executing stuff and replying to the client. Uses promises to get stuff done.
*/
/* eslint promise/always-return: "off" */

'use strict';

const boom = require('boom'), //Boom gives us some predefined http codes and proper responses
  questionDB = require('../database/questionDatabase'), //Database functions specific for questions
  co = require('../common');

const Microservices = require('../configs/microservices');
const rp = require('request-promise-native');

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
    questionDB.get(Number(request.params.id)).then((question) => {
      if (co.isEmpty(question))
        reply(boom.notFound());
      else
        reply(co.rewriteID(question));
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //Get all questions from database for a deck/slide or return NOT FOUND
  getRelatedQuestions: function(request, reply) {
    const related_object = request.params.related_object;
    const related_object_id = request.params.related_object_id;
    const include_subdecks_and_slides = request.query.include_subdecks_and_slides;
    const exam_questions_only = request.query.exam_questions_only;
    const metaonly = request.query.metaonly;
    if (include_subdecks_and_slides !== 'true') {
      if (metaonly === 'true') {
        return questionDB.getCountOfAllRelated(related_object, related_object_id, exam_questions_only)
          .then((count) => {
            reply ({count: count});
          }).catch((error) => {
            tryRequestLog(request, 'error', error);
            reply(boom.badImplementation());
          });
      } else {
        return questionDB.getAllRelated(related_object, related_object_id, exam_questions_only)
          .then((questions) => {
            questions.forEach((question) => {
              co.rewriteID(question);
            });

            let jsonReply = JSON.stringify(questions);
            reply(jsonReply);
          }).catch((error) => {
            request.log('error', error);
            reply(boom.badImplementation());
          });
      }
    } else {
      return getSubdecksAndSlides(related_object, related_object_id).then((arrayOfDecksAndSlides) => {
        let slideIdArray = [];
        let deckIdArray = [];

        arrayOfDecksAndSlides.forEach((deckOrSlide) => {
          if (deckOrSlide.type === 'slide') {
            slideIdArray.push(deckOrSlide.id);
          } else {
            deckIdArray.push(deckOrSlide.id);
          }
        });

        if (metaonly === 'true') {
          return questionDB.getCountAllWithProperties(slideIdArray, deckIdArray, exam_questions_only)
            .then((count) => {
              reply ({count: count});
            }).catch((error) => {
              tryRequestLog(request, 'error', error);
              reply(boom.badImplementation());
            });
        } else {
          return questionDB.getAllWithProperties(slideIdArray, deckIdArray, exam_questions_only)
            .then((questions) => {
              questions.forEach((question) => {
                co.rewriteID(question);

                //set content_name
                const slide = arrayOfDecksAndSlides.find((slide) =>  (slide.type === question.related_object && slide.id === question.related_object_id));
                if (slide) {
                  question.related_object_name = slide.title;
                }
              });

              let jsonReply = JSON.stringify(questions);
              reply(jsonReply);
            }).catch((error) => {
              request.log('error', error);
              reply(boom.badImplementation());
            });
        }
      }).catch((error) => {
        tryRequestLog(request, 'error getSubdecksAndSlides', error);
        reply(boom.badImplementation());
      });
    }
  },

  //Create Question with new id and payload or return INTERNAL_SERVER_ERROR
  newQuestion: function(request, reply) {
    questionDB.insert(Object.assign({'related_object':request.params.related_object},request.payload)).then((inserted) => {
      if (co.isEmpty(inserted) || co.isEmpty(inserted.ops[0]))
        throw inserted;
      else
        reply(co.rewriteID(inserted.ops[0]));
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  // replace an existing question
  replaceQuestion: function(request, reply) {
    questionDB.replace(Number(request.params.id), request.payload).then((replaced) => {
      if (co.isEmpty(replaced)){
        reply(boom.notFound());
        throw replaced;
      }
      else{
        reply(co.rewriteID(replaced.value));
      }
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  },

  //alter is_exam_question
  updateExamList: function(request, reply) {
    const modifiedQuestions = request.payload;
    let yesExamQuestions = [];
    let notExamQuestions = [];
    modifiedQuestions.forEach((question) => {
      if (question.is_exam_question) {
        yesExamQuestions.push(question.id);
      } else {
        notExamQuestions.push(question.id);
      }
    });
    const queryYes = {
      id: { $in: yesExamQuestions }
    };

    return questionDB.partlyUpdate(queryYes, {
      $set: {
        is_exam_question: true
      }
    }, {multi: true} ).then(() => {
      const queryNot = {
        id: { $in: notExamQuestions }
      };
      return questionDB.partlyUpdate(queryNot, {
        $set: {
          is_exam_question: false
        }
      }, {multi: true} ).then(() => {
        reply({'msg': 'is_exam_question params are successfully altered...'});
      }).catch((error) => {
        tryRequestLog(request, 'error', error);
        reply(boom.badImplementation());
      });
    }).catch((error) => {
      tryRequestLog(request, 'error', error);
      reply(boom.badImplementation());
    });
  },

  //Delete Question using an id or return INTERNAL_SERVER_ERROR
  deleteQuestion: function(request, reply) {
    questionDB.get(Number(request.params.id)).then((question) => {
      if (co.isEmpty(question))
        reply(boom.notFound());
      else
        return Number(request.params.id);
    }).then((delete_id) => {
      questionDB.remove(delete_id).then((deleted) => {
        reply(co.rewriteID(deleted));
      }).catch((error) => {
        request.log('error', error);
        reply(boom.badImplementation());
      });
    }).catch((error) => {
      request.log('error', error);
      reply(boom.badImplementation());
    });
  }
};


function getSubdecksAndSlides(content_kind, id) {
  let myPromise = new Promise((resolve, reject) => {
    if (content_kind === 'slide') {
      resolve([{
        type: content_kind,
        id: id
      }]);
    } else {//if deck => get activities of all its decks and slides
      let arrayOfSubdecksAndSlides = [];
      rp.get({uri: Microservices.deck.uri +  '/decktree/' + id}).then((res) => {

        try {
          let parsed = JSON.parse(res);
          arrayOfSubdecksAndSlides = getArrayOfChildren(parsed);
        } catch(e) {
          console.log(e);
          resolve(arrayOfSubdecksAndSlides);
        }

        resolve(arrayOfSubdecksAndSlides);
      }).catch((err) => {
        console.log('Error', err);

        resolve(arrayOfSubdecksAndSlides);
      });
    }
  });

  return myPromise;
}

function getArrayOfChildren(node) {//recursive
  const idWithoutRevision = node.id.split('-')[0];
  let array = [{
    type: node.type,
    id: idWithoutRevision,
    title: node.title
  }];
  if (node.children) {
    node.children.forEach((child) => {
      array = array.concat(getArrayOfChildren(child));
    });
  }
  return array;
}

//This function tries to use request log and uses console.log if this doesnt work - this is the case in unit tests
function tryRequestLog(request, message, _object) {
  try {
    request.log(message, _object);
  } catch (e) {
    console.log(message, _object);
  }
}
