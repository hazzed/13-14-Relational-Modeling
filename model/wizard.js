'use strict';

const mongoose = require('mongoose');
const Category = require('./category');
const httpErrors = require('http-errors');

const wizardSchema = mongoose.Schema ({
  name:{
    type:String,
    required:true,
    unique:true,
  },
  content : {
    type : String,
    required : true,
  },
  timestamp: {
    type:Date,
    default: () => new Date(),
  },
  category: {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref : 'category',
  },
});

//-----------------------------------------------------
// SETTING UP RELATIONSHIP MANAGEMENT
//-----------------------------------------------------
wizardSchema.pre('save',function(done){
  //making sure that the category exists before saving a wizard
  return Category.findById(this.category)
    .then(categoryFound => {
      if(!categoryFound)
        throw httpErrors(404,'category not found');
      
      categoryFound.wizards.push(this._id);
      return categoryFound.save();
    })
    .then(() => done())
    .catch(done);
});

wizardSchema.post('remove',(document,done) => {
  return Category.findById(document.category)
    .then(categoryFound => {
      if(!categoryFound)
        throw httpErrors(404,'category not found');
      
      categoryFound.wizards = categoryFound.wizards.filter(wizard => {
        return wizard._id.toString() !== document._id.toString();
      });
      return categoryFound.save();
    })
    .then(() => done())
    .catch(done);
});
//-----------------------------------------------------

module.exports = mongoose.model('wizard',wizardSchema);