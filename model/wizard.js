'use strict';

const mongoose = require('mongoose');

const wizardSchema = mongoose.Schema ({
  name: {
    type:String,
    required:true,
    unique:true,
  },
  type:{
    type:String,
    required:true,
    unique:false,
  },
  city: {
    type: String,
    required: true,
    unique: false,
  },
});

module.exports = mongoose.model('wizard',wizardSchema);