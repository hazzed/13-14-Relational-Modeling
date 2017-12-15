'use strict';

const mongoose = require('mongoose');

const wizardSchema = mongoose.Schema ({
  name:{
    type:String,
    required:true,
    unique:true,
  },
  type:{
    type:String,
    required:true,
    unique:false,
  },
  city:{
    type: String,
    required: true,
    unique: false,
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