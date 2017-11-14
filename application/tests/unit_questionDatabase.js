// example unit tests
/* eslint promise/no-callback-in-promise: "off" */
'use strict';

//Mocking is missing completely TODO add mocked objects

describe('Database', () => {

  /*

  let db, helper; //expect

  before((done) => {
    require('chai').should();
    let chai = require('chai');
    let chaiAsPromised = require('chai-as-promised');
    chai.use(chaiAsPromised);
    //expect = require('chai').expect;
    db = require('../database/questionDatabase.js');
    helper = require('../database/helper.js');
    helper.cleanDatabase()
      .then(() => done())
      .catch((error) => done(error));
  });

  context('when having an empty database', () => {
    it('should return null when requesting a non existant question', () => {
      return db.get('asd7db2daasd').should.be.fulfilled.and.become(null);
    });

    it('should return the question when inserting one', () => {
      let question =
      {
        "related_object": "slide",
        "related_object_id": "string",
        "question": "string",
        "user_id": "string",
        "difficulty": 0,
        "choices": [
          "string"
        ]
      };
      let res = db.insert(question);
      return Promise.all([
        res.should.be.fulfilled.and.eventually.not.be.empty,
        res.should.eventually.have.property('ops').that.is.not.empty,
        res.should.eventually.have.deep.property('ops[0]').that.has.all.keys('_id', 'related_object', 'related_object_id', 'question', 'choices'),
        res.should.eventually.have.deep.property('ops[0].question', question.question)
      ]);
    });

    it('should get an previously inserted question', () => {
      let slide = {
        question: 'dummy',
        related_object: 'slide',
        related_object_id: '12345',
        choices: [
          "dummy"
        ] 
      };
      let ins = db.insert(question);
      let res = ins.then((ins) => db.get(ins.ops[0]._id));
      return Promise.all([
        res.should.be.fulfilled.and.eventually.not.be.empty,
        res.should.eventually.have.all.keys('_id', 'related_object', 'related_object_id', 'question', 'choices'),
        ins.then((question) => res.should.eventually.deep.equal(slide.ops[0]))
      ]);
    });

    it('should be able to replace an previously inserted question', () => {
      let slide = {
        question: 'dummy',
        related_object: 'slide',
        related_object_id: '12345',
        choices: [
          "dummy"
        ] 
      };
      let slide = {
        question: 'Dummy2',
        related_object: 'deck',
        related_object_id: '123456',
        choices: [
          "dummy"
        ] 
      };
      let ins = db.insert(slide);
      let res = ins.then((ins) => db.replace(ins.ops[0]._id, slide2));
      return Promise.all([
        res.should.be.fulfilled.and.eventually.not.be.empty,
        res.should.eventually.have.property('value').that.contains.all.keys('_id', 'related_object', 'related_object_id', 'question', 'choices'),
        res.should.eventually.have.property('value').that.has.property('question', question.question) // FIXME returns old object
        //ins.then((slide) => res.should.eventually.have.deep.property('value._id', slide.ops[0]._id))//FIXME works, but fails because of .... santa
      ]);
    });
  });
  */
});
