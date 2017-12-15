'use strict';

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  title : {type: String,
    required: true,
    unique: true,
  },
  keywords : [{type :String}],
  timeStamp : {type : Date,
    default : () => new Date() },
  wizards : [{type : mongoose.Schema.Types.ObjectId,
    ref : 'catergorie'}],
},{ 
  usePushEach : true, 
});


module.exports = mongoose.model('categorie',categorySchema);