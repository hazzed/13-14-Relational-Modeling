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
    .catch(error => next(error));
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
  logger.log('info', 'GET - processing a request');
  return Wizard.find({})
    .then(wizards =>{
      return response.json(wizards);
    }).catch(next);
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

wizardRouter.delete('/api/wizards', (request, response, next) => {
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

wizardRouter.put('/api/wizards', (request, response, next) => {
  logger.log('info', 'PUT - request without an id.  Returning 400');
  return response.sendStatus(400);
});