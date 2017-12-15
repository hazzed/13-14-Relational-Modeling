'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Category = require('../model/category');

const categoryRouter = module.exports = new Router();

categoryRouter.post('/api/categorys',jsonParser,(request,response,next) => {
  if(!request.body.title)
    return next(httpErrors(400,'category model requires a title'));

  return new Category(request.body).save()
    .then(category => response.json(category))
    .catch(next);
});

categoryRouter.put('/api/categorys/:id',jsonParser,(request,response,next) => {
  let options = {new : true, runValidators : true};

  return Category.findByIdAndUpdate(request.params.id,request.body,options)
    .then(category => {
      if(!category)
        throw httpErrors(404,'category not found');
      return response.json(category);
    })
    .catch(next);
});

categoryRouter.get('/api/categorys/:id',(request,response,next) => {
  return Category.findById(request.params.id)
    .then(category => {
      if(!category)
        throw httpErrors(404,'category not found');
      return response.json(category);
    })
    .catch(next);
});


categoryRouter.delete('/api/categorys/:id',(request,response,next) => {
  return Category.findByIdAndRemove(request.params.id)
    .then(category => {
      if(!category)
        throw httpErrors(404,'category not found');
      
      return response.sendStatus(204);
    })
    .catch(next);
});