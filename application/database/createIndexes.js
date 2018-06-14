'use strict';

const helper = require('./helper');

// this function should include commands that create indexes (if any)
// for any collections that the service may be using

// it should always return a promise
module.exports = function() {

  return helper.getCollection('questions').then((questions) => {
    return questions.createIndexes([
      { key: {'related_object': 1, 'related_object_id': 1} }
    ]);
  });

};
