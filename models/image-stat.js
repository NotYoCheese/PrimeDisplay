var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var imageStatSchema= new Schema({
  /* user:              {type : Schema.ObjectId, ref : 'User'}, */
  user:         {type: ObjectId},
  user_domain:  {type: String},
  impressions:  {type: Number, 'default': 0},
  raw_url:      {type: String, 'default': 'none_' + Math.floor(Math.random()*100000000)},
  serve_url:    {type: String, 'default': 'none_' + Math.floor(Math.random()*100000000)},
  creationDate: {type: Date, 'default': Date.now},
});

imageStatSchema.index({user: 1, user_domain: 1, raw_url: 1}, {unique: true});
/* imageStatSchema.index({raw_url: 1}, {unique: true}); */
/* imageStatSchema.index({serve_url: 1}, {unique: true}); */

imageStatSchema.statics = {

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}

module.exports = mongoose.model('ImageStat', imageStatSchema);


