'use strict';
/**
 * GET|PUT /image-stat
 * 
 * retrieve or increment image stats
 */

var ImageStat = require('../models/image-stat');

exports.getImageStat = function(req, res)
{
  if (req.user === undefined) {
    req.flash('errors', {msg: 'You must be logged in to use this feature'});
    res.redirect('/login');
    return;
  }
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 10
  var options = {
    perPage: perPage,
    page: page,
    criteria: {'user': req.user._id}
  }

  ImageStat.list(options, function(err, results)
  {
    if (err) return res.render('500');
    ImageStat.count(options.criteria).exec(function (err, count)
    {
      res.render('image-stat',
      {
        _pd_allImages: results,
        page: page + 1,
        pages: Math.ceil(count / perPage),
  createPagination: function (pages, page) {
    var url = require('url')
    , qs = require('querystring')
    , params = qs.parse(url.parse(req.url).query)
    , str = '<ul class="pagination">'

    params.page = 0
    var clas = page == 0 ? "active" : "no"
    str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">First</a></li>'
    for (var p = 1; p <= pages; p++)
    {
      params.page = p
      clas = page == p ? "active" : "no"
      str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">' +  p  + '</a></li>'
    }
    params.page = --p
    clas = page == params.page ? "active" : "no"
    str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">Last</a></li></ul>'

    return str
  }
      });
    });
  });
};

exports.getImageStatServed = function(req, res) {
  res.render('image-stat-served');
};

var processAsyncDBResult = function(curentItem, completion) {

  return function(err, result) {
    if (err) {
      completion(err, undefined);
    } else {
      var isNew = false;
      var pdServeURL = '';
      if(curentItem.raw_url.indexOf('http://') == 0)
      {
        pdServeURL = 'http://' + GLOBAL.pd_img_website + '/' + curentItem.userId
          + '/wid/hi/u' + curentItem.raw_url.substr(6);
      }
      else if(curentItem.raw_url.indexOf('https://') == 0)
      {
        pdServeURL = 'https://' + GLOBAL.pd_img_website + '/' + curentItem.userId
          + '/wid/hi/u' + curentItem.raw_url.substr(7);
      }
      else
      {
        pdServeURL = 'http://' + GLOBAL.pd_img_website + '/' + curentItem.userId
          + '/wid/hi/u' + curentItemraw_url;
      }
      if(result == null) {
        result = new ImageStat({'user': curentItem.user, 
          'user_domain': curentItem.user_domain,
         'raw_url': curentItem.raw_url, 'impressions': 1, 'serve_url': pdServeURL});
        isNew = true;
      } else {
        result.serve_url = pdServeURL;
        result.impressions++;
      }
      result.save(function(err) {
        if(err) {
          console.log(err);
          completion(err, undefined);
        } else {
          var resultObject = result.toObject();
          resultObject.isNew = isNew;
          completion(undefined, resultObject);
        }
      });
    }
  };
};

exports.postImageStatAdd = function(req, res) {
  var imgRequest = req.body;
  var userId = imgRequest._pdAccount;
  var userDomain = imgRequest._pdDomain;
  var urlsToAdd = imgRequest.all_urls;
  var index = 0;
  var numProcessed = 0;
  var resultArray = [];
  for(index = 0; index < urlsToAdd.length; index++) {
    //console.log('processing image '+ index + ' ' + urlsToAdd[index]);

    var curentItem = {'user': userId, 
      'user_domain': userDomain,
      'raw_url': urlsToAdd[index]
    };
    ImageStat.findOne(curentItem, processAsyncDBResult(curentItem,
      function(err, result) {
        if (err) {
          console.log('returning error: ' + err);
          res.status(500);
          res.send(err);
        } else {
          resultArray.push(result);
          //console.log('total: ' + urlsToAdd.length + ' numProcessed: ' + (numProcessed +1));
          if (++numProcessed >= urlsToAdd.length) {
            res.send({result: resultArray});
          }
        }
      }));
  }
};

