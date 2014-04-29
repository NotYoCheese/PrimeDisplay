"use strict";

var Readable = require('stream').Readable;
var Scraper = require('../models/scraper')
var filesize = require('filesize');
var request = require('request');
var url = require('url');

var formatUrl = function(userInput) {
  var parsedUrl = url.parse(userInput);
  if (!parsedUrl.protocol) {
      parsedUrl.protocol = 'http:';
      parsedUrl.slashes = true;
  }
  return url.format(parsedUrl);
};

var processAnalyzeResult = function(req, res, responseData) {
  return function(err, data) {
    if (err) {
        var errorMessage = { msg: 'Error connecting to the analyzer: ' 
          + err.toString() };
        req.flash('errors', errorMessage);
        return res.redirect('/analyze');      
      }
      //console.log('data: ');
      //console.log(data);
      var analysisData = JSON.parse(data);
      if (analysisData.error != undefined) {
        var errorMessage = { msg: 'Analyzer returned error: ' 
          + analysisData.error.errors[0].message };
        req.flash('errors', errorMessage);
        return res.redirect('/analyze');      

      }

      if (analysisData !== undefined) {
        var rawPageSize = 0;

        if (analysisData.pageStats.htmlResponseBytes != undefined)
          rawPageSize += parseInt(analysisData.pageStats.htmlResponseBytes);
        if (analysisData.pageStats.textResponseBytes != undefined)
          rawPageSize += parseInt(analysisData.pageStats.textResponseBytes);
        if (analysisData.pageStats.flashResponseBytes != undefined)
          rawPageSize += parseInt(analysisData.pageStats.flashResponseBytes);
        if (analysisData.pageStats.cssResponseBytes != undefined)
          rawPageSize += parseInt(analysisData.pageStats.cssResponseBytes);
        if (analysisData.pageStats.imageResponseBytes != undefined)
          rawPageSize += parseInt(analysisData.pageStats.imageResponseBytes);
        if (analysisData.pageStats.javascriptResponseBytes != undefined)
          rawPageSize += parseInt(analysisData.pageStats.javascriptResponseBytes);
        if (analysisData.pageStats.otherResponseBytes != undefined)
          rawPageSize += parseInt(analysisData.pageStats.otherResponseBytes);

        var humanReadablePageSize = filesize(rawPageSize);

        var thumbnailSrc = analysisData.screenshot.data;
        // apparently the google pagespeed API has a bug with their base64 data
        // to fix it on must:
        // replace all '_' with '/' and all '-' with '+'.
        thumbnailSrc = thumbnailSrc.replace(/\_/g, '/');
        thumbnailSrc = thumbnailSrc.replace(/\-/g, '+');
        thumbnailSrc = 'data:' + analysisData.screenshot.mime_type + ';base64,' + thumbnailSrc;

        // console.log('source: ' + thumbnailSrc);
        // console.log('width: ' + analysisData.screenshot.width);
        // console.log('height: ' + analysisData.screenshot.height);

        return res.render('analyze_results', {'urlAnalyzed': analysisData.id,
          'thumbnailSrc': thumbnailSrc,
          'humanReadablePageSize': humanReadablePageSize,
          'analysisData': analysisData});
      } else {
        return res.redir('/analyze');
      }
  };
};

var analyzeSite = function(responseData, pageSpeedCompletion) {
        //https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=http://direct.coinsociety.com&key=AIzaSyAOvKPPQgN53SbANdmkXYo4Lqi0FEzetfs
        var googleUrl = 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?'
        + 'screenshot=true'
        + '&key=AIzaSyAQkevzX-WSF47HILMcFns_qVx-y-YmhC0'
        + '&url='
        + responseData.urlToScrape;
        var req = {
            uri : googleUrl,
            timeout : 50000,
            headers : {
                'User-Agent' : 'Mozilla/5.0 (compatible; PrimeDisplay)'
            }
        };

        request(req, function(err, response, body) {
            pageSpeedCompletion(err, body);
        });
    };
/**
 * GET /analyze
 * Analyze page.
 */

exports.getAnalyze = function(req, res) {
    res.render('analyze', {
        title : 'Analyze',
        urlAnalyzed: 'http://direct.coinsociety.com'
    });
};

exports.postAnalyze = function(req, res) {
  var scrapeList,
        errors;
  req.assert('site', 'Please enter a valid URL').notEmpty();
  errors = req.validationErrors();
  
  if (errors) {
      // console.log('errors: ');
      // console.dir(errors);
      req.flash('errors', errors);
      return res.redirect('/analyze');
  }
  
  var urlToScrape = formatUrl(req.body.site);
  var responseData = { pageSpeedComplete: false, localPagesComplete: false,
    urlToScrape: urlToScrape};

  analyzeSite(responseData, processAnalyzeResult(req, res, responseData));
};