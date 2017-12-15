'use strict';

const faker = require('faker');
const categoryMock = require('./category-mock');
const Wizard = require('../../model/wizard');

const wizardMock = module.exports = {};

wizardMock.create = () => {
  let mock = {};

  return categoryMock.create()
    .then(category => {
      mock.category = category;

      return new Wizard({
        name : faker.lorem.words(7),
        content : faker.lorem.words(100),
        category : category._id,
      }).save();
    })
    .then(wizard => {
      mock.wizard = wizard;
      return mock;
    });
};

wizardMock.createMany = (howMany) => {
  let mock = {};

  return categoryMock.create()
    .then(category => {
      mock.category = category;
      return Promise.all(new Array(howMany)
        .fill(0)
        .map(() => {
          return new Wizard({
            name : faker.lorem.words(7),
            content : faker.lorem.words(100),
            category : category._id,
          }).save();
        }));
    })
    .then(wizards => {
      mock.wizards = wizards;
      return mock;
    });
};

wizardMock.remove = () => Promise.all([
  Wizard.remove({}),
  categoryMock.remove(),
]);