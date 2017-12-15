'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const categoryMock = require('./lib/category-mock');

const apiURL = `http://localhost:${process.env.PORT}/api/categorys`;

describe('/api/categorys', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(categoryMock.remove);

  describe('POST /categorys', () => {
    test('should return a 200 and a category if there are no errors', () => {
      return superagent.post(apiURL)
        .send({
          title: 'Wizard Town', 
          keywords: ['snow', 'ice'],
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.keywords).toEqual(['snow', 'ice']);
        });
    });

    test('should respond with a 400 if incomplete post request', () => {
      return superagent.post(apiURL)
        .send({
          size: '2',
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should return a 409 due to a duplicate name', () => {
      return categoryMock.create()
        .then(category => {
          return superagent.post(apiURL)
            .send({
              title: category.title,
              keywords: [],
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
  });

  describe('GET /categorys/:id', () => {
    test('should respond with a 200 status and a category if there are no errors', () => {
      let tempCategoryMock;

      return categoryMock.create()
        .then(category => {
          tempCategoryMock = category;
          return superagent.get(`${apiURL}/${category.id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(JSON.stringify(response.body.keywords))
            .toEqual(JSON.stringify(tempCategoryMock.keywords));
        });
    });

    test('GET should respond with 404 status code if the id is incorrect', () => {
      return superagent.get(`${apiURL}bob`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('PUT /categorys/:id', () => {
    test('should update category and respond with 200 if there are no errors', () => {
      let categoryToUpdate = null;
      
      return categoryMock.create()
        .then(category => {
          categoryToUpdate = category;
          return superagent.put(`${apiURL}/${category._id}`)
            .send({title: 'Town'});
        }).then(response => { 
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('Town');
          expect(response.body._id).toEqual(categoryToUpdate._id.toString()); 
        });
    });

    test('should return a 400 status code if invalid PUT request', () => {
      return categoryMock.create()
        .then(category => superagent.put(`${apiURL}/${category._id}`))
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should return a 404 status code if id is invalid', () => {
      return categoryMock.create()
        .then(() => superagent.put(`${apiURL}/invalidId`))
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('should respond with a 409 status code if a key is unique', () => {
      let categoryToPostOne = {
        title : 'WizardTown',
      };

      let categoryToPostTwo = {
        title : 'WizardTown2',
      };

      return superagent.post(`${apiURL}`)
        .send(categoryToPostOne)
        .then(() => { 
          return superagent.post(`${apiURL}`)
            .send(categoryToPostTwo);
        })
        .then(response => {
          return superagent.put(`${apiURL}/${response.body._id}`)
            .send({title: 'WizardTown'});
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
  });

  describe('DELETE /api/categorys/:id', () => {
    test('DELETE should respond with 204 status code with no content in the body if successfully deleted', () => {
      return categoryMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/${mock._id}`)
            .then(response => {
              expect(response.status).toEqual(204);
            });
        });
    });
  
    test('DELETE should respond with 404 status code if id is invalid', () => {
      return superagent.delete(`${apiURL}/invalidId`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

  });

});