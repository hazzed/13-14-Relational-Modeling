'use strict';

const mongoose = require('mongoose');

const wizardSchema = mongoose.Schema ({
  name:{
    type:String,
    required:true,
    unique:true,
  },
  content : {
    type : String,
    required : true,
    minlength : 10,
  },
  timestamp: {
    type:Date,
    default: () => new Date(),
  },
  category: {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref : 'magic',
  }
});

module.exports = mongoose.model('wizard',wizardSchema);