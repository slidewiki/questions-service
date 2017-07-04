/* eslint dot-notation: 0, no-unused-vars: 0 */
'use strict';

//Mocking is missing completely TODO add mocked objects

describe('REST API', () => {

  /*
  let server;

  beforeEach((done) => {
    //Clean everything up before doing new tests
    Object.keys(require.cache).forEach((key) => delete require.cache[key]);
    require('chai').should();
    let hapi = require('hapi');
    server = new hapi.Server();
    server.connection({
      host: 'localhost',
      port: 3000
    });
    require('../routes.js')(server);
    done();
  });

  let question = {
    "related_object": "slide",
    "related_object_id": "dummy",
    "question": "dummy",
    "user_id": "dummy",
    "difficulty": 1,
    "choices": [
      "dummy",
      "dummy",
      "dummy",
      "dummy"
    ]
  };
  let options = {
    method: 'POST',
    url: '/slide/question',
    payload: question,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  context('when creating a question it', () => {
    it('should reply it', (done) => {
      server.inject(options, (response) => {
        response.should.be.an('object').and.contain.keys('statusCode','payload');
        response.statusCode.should.equal(200);
        response.payload.should.be.a('string');
        let payload = JSON.parse(response.payload);
        payload.should.be.an('object').and.contain.keys('related_object','related_object_id','question');
        payload.related_object.should.equal('slide');
        payload.related_object_id.should.equal('dummy');
        payload.question.should.equal('dummy');
        done();
      });
    });
  });
  */
});
