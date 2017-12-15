'use strict';


require('./lib/setup');

const faker = require('faker');
const superagent = require('superagent');
// const Wizard = require('../model/wizard');
const server = require('../lib/server');

const logger = require('../lib/logger');

const wizardMock = require('./lib/wizard-mock');
const categoryMock = require('./lib/category-mock');

const apiURL = `http://localhost:${process.env.PORT}/api/wizards`;


describe('/api/wizards', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(wizardMock.remove);


  describe('POST /api/wizards', () => {
    test.only('should respond with a wizard and 200 status code if there is no error', () => {
      let tempCategoryMock = null;
      return categoryMock.create()
        .then(mock => {
          tempCategoryMock = mock;

          let wizardToPost = {
            name: faker.lorem.words(5),
            content: faker.lorem.words(5),
            category : mock._id,
          };


          console.log(wizardToPost);


          return superagent.post(`${apiURL}`)
            .send(wizardToPost)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toBeTruthy();
              expect(response.body.timestamp).toBeTruthy();

              expect(response.body.category).toEqual(tempCategoryMock._id.toString());

              expect(response.body.name).toEqual(wizardToPost.name);
              expect(response.body.content).toEqual(wizardToPost.content);
            });
          // .catch(error => logger.log('error', error));
        });

    });
    test('should respond with a 400 code if we send an incomplete wizard', () => {
      let wizardToPost = {
        name: faker.lorem.words(1),
      };
      return superagent.post(`${apiURL}`)
        .send(wizardToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should respond with 409 status code if name is a duplicate', () => {
      let wizardToPost = {
        name: faker.lorem.words(1),
        type: faker.lorem.words(1),
        city: faker.lorem.words(1),
      };
      return superagent.post(`${apiURL}`)
        .send(wizardToPost)
        .then( () => {
          return superagent.post(`${apiURL}`)
            .send(wizardToPost);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });

  });

  describe('GET /api/wizards/:id', () => {
    test('should respond with 200 status code if there is no error', () => {
      let wizardToTest = null;

      return wizardMockCreate()
        .then(wizard => {
          wizardToTest = wizard;
          return superagent.get(`${apiURL}/${wizard._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(wizardToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.name).toEqual(wizardToTest.name);
          expect(response.body.city).toEqual(wizardToTest.type);
          expect(response.body.state).toEqual(wizardToTest.city);
        })
        .catch(error => logger.log('error', error));
    });
    test('should respond with 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}/Bob`)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

  });
  describe('GET /api/wizards', () => {
    test('Should return array of objects of all wizards and status 200', () => {

      return wizardMockCreate()
        .then( () => {
          return superagent.get(`${apiURL}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(1);
        });
    });
  });
  describe('DELETE /api/wizards/:id', () => {
    test('should respond with 204 status code if there is no error', () => {

      return wizardMockCreate()
        .then(wizard => {
          return superagent.delete(`${apiURL}/${wizard._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with 400 if no id is sent', () => {
      return superagent.delete(`${apiURL}`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
    test('should respond with 404 if invalid id is sent', () => {
      return superagent.delete(`${apiURL}/Bob`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

  });

  describe('PUT /api/wizards', () => {
    test('should update wizard and respond with 200 if there are no errors', () => {
      let wizardToUpdate = null;

      return wizardMockCreate()
        .then(wizard => {
          wizardToUpdate = wizard;
          return superagent.put(`${apiURL}/${wizard._id}`)
            .send({name: 'Harry Potter'});
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual('Harry Potter');
          expect(response.body.city).toEqual(wizardToUpdate.city);
          expect(response.body._id).toEqual(wizardToUpdate._id.toString());
        });
    });

    test('should respond with 404 if invalid id is sent', () => {
      return superagent.put(`${apiURL}/bob`)
        .send({name: 'Harry Potter'})
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('should respond with 400 if no id is sent', () => {
      return superagent.put(`${apiURL}`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should respond with 409 status code if name is a duplicate', () => {
      let wizardToPostOne = {
        name: 'Voldemort',
        city: faker.lorem.words(1),
        state: faker.lorem.words(1),
      };
      let wizardToPostTwo = {
        name: faker.lorem.words(1),
        city: faker.lorem.words(1),
        state: faker.lorem.words(1),
      };
      return superagent.post(`${apiURL}`)
        .send(wizardToPostOne)
        .then( () => {
          return superagent.post(`${apiURL}`)
            .send(wizardToPostTwo);
        })
        .then( (response) => {
          return superagent.put(`${apiURL}/${response.body._id}`)
            .send({name: 'Voldemort'});
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        })
        .catch(error => logger.log('error', error));
    });


  });


});