/**
 * Created by lfernandes on 07.06.17.
 */
/*
 Controller for handling mongodb and the data model questions while providing CRUD'ish.
 */

'use strict';

const helper = require('./helper'),
  questionModel = require('../models/question.js');

module.exports = {

  get: function (identifier) {
    return helper.connectToDatabase()
      .then((db) => db.collection('questions'))
      .then((col) => col.findOne({
        _id: identifier
      }));
  },

  remove: function (identifier) {
    return helper.connectToDatabase()
      .then((db) => db.collection('questions'))
      .then((col) => col.remove({
        _id: identifier
      }));
  },

  getAll: function() {
    return helper.connectToDatabase()
      .then((db) => db.collection('questions'))
      .then((col) => col.find())
      .then((stream) => stream.sort({timestamp: -1}))
      .then((stream) => stream.toArray());
  },

  getAllRelated: function (relObject, relObjectId) {
    return helper.connectToDatabase()
      .then((db) => db.collection('questions'))
      .then((col) => col.find({
        related_object: relObject,
        related_object_id: objectId
      }));
  },

  insert: function (question) {
    //TODO check for root and parent deck ids to be existent, otherwise create these
    return helper.connectToDatabase()
      .then((db) => helper.getNextIncrementationValueForCollection(db, 'questions'))
      .then((newId) => {
        // console.log('newId', newId);
        return helper.connectToDatabase() //db connection have to be accessed again in order to work with more than one collection
          .then((db2) => db2.collection('questions'))
          .then((col) => {
            let valid = false;
            question._id = newId;
            try {
              valid = questionModel(question);
              // console.log('validated questionModel', valid);
              if (!valid) {
                return questionModel.errors;
              }
              return col.insertOne(question);
            } catch (e) {
              console.log('validation failed', e);
            }
            return;
          }); //id is created and concatinated automatically
      });
  },

  replace: function (id, question) {
    return helper.connectToDatabase()
      .then((db) => db.collection('questions'))
      .then((col) => {
        let valid = false;
        try {
          valid = questionModel(question);
          if (!valid) {
            return questionModel.errors;
          }
          return col.findOneAndReplace({
            _id: id
          }, question);
        } catch (e) {
          console.log('validation failed', e);
        }
        return;
      });
  }
};
