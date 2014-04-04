var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var imageStatSchema= new Schema({
  user:		{type : Schema.ObjectId, ref : 'User'},
  impressions:	{type: Number, 'default': 0},
  raw_url:	{type: String, 'default': 'none_' + Math.floor(Math.random()*100000000)},
  serve_url:	{type: String, 'default': 'none_' + Math.floor(Math.random()*100000000)},
  creationDate:	{type: Date, 'default': Date.now},
});

imageStatSchema.index({raw_url: 1}, {unique: true});
imageStatSchema.index({serve_url: 1}, {unique: true});

module.exports = mongoose.model('ImageStat', imageStatSchema);

