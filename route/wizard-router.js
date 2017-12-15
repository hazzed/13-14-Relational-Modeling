'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();

const Wizard = require('../model/wizard');
const logger = require('../lib/logger');
const httpErrors = require('http-errors');

const wizardRouter = module.exports = new Router();

wizardRouter.post('/api/wizards', jsonParser, (request,response, next) => {
  logger.log('info', 'POST - processing a request');

  if(!request.body.name || !request.body.content) {
    return next(httpErrors(400, 'name and content are required'));
  }

  return new Wizard(request.body).save()
    .then(wizard => response.json(wizard))
    .catch(next);
});

wizardRouter.get('/api/notes/:id',(request,response,next) => {
  return Wizard.findById(request.params.id)
    .populate('category')// vinicio - use this with care
    .then(wizard => {      // wit great power comes great responsibility
      if(!wizard){
        throw httpErrors(404,'note not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(wizard);
    }).catch(next);
});

wizardRouter.get('/api/wizards', (request, response, next) => {
  const PAGE_SIZE = 10;
  let {page = '0'} = request.query;
  page = Number(page);
  
  if(isNaN(page)) 
    page = 0;
  
  page = page < 0 ? 0 : page;
  
  let allWizards = null;
  
  return Wizard.find({})
    .skip(page * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .then(wizards => {
      allWizards = wizards;
      return Wizard.find({}).count();
    })
    .then(wizardCount => {
      let responseData = {
        count : wizardCount,
        data: allWizards,
      };
      let lastPage = Math.floor(wizardCount / PAGE_SIZE);
      response.links({
        next: `http://localhost:${process.env.PORT}/api/wizards?page=${page === lastPage ? lastPage : page + 1}`,
        prev: `http://localhost:${process.env.PORT}/api/wizards?page=${page < 1 ? 0 : page - 1}`,
        last: `http://localhost:${process.env.PORT}/api/wizards?page=${lastPage}`,
      });
  
      response.json(responseData);
    });
});


wizardRouter.delete('/api/wizards/:id', (request, response, next) => {
  logger.log('info', 'DELETE - processing a request');

  return Wizard.findByIdAndRemove(request.params.id)
    .then(wizard => {
      if(!wizard){
        throw httpErrors(404, 'wizard not found');
      }
      logger.log('info', 'DELETE - Returning a 204 status code');
      return response.sendStatus(204);
    }).catch(next);
});

wizardRouter.delete('/api/wizards', (request, response) => {
  logger.log('info', 'DELETE - request without an id.  Returning 400');
  return response.sendStatus(400);
});

wizardRouter.put('/api/wizards/:id', jsonParser ,(request,response,next) => {
  logger.log('info', 'PUT - processing a request');
  let options = {runValidators: true, new : true};

  return Wizard.findByIdAndUpdate(request.params.id, request.body, options)
    .then(wizard => {
      if(!wizard){
        throw httpErrors(404, 'wizard not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(wizard);
    }).catch(next);
});
