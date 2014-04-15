"use strict";

var Readable = require('stream').Readable;
var Scraper = require('../models/scraper')
var filesize = require('filesize');

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
  var scraper = Scraper.create();
  var scrapeList,
        errors;
  req.assert('site', 'Please enter a valid URL').notEmpty();
  errors = req.validationErrors();
  console.log(req.body);

  if (errors) {
      console.log('errors: ');
      console.dir(errors);
      req.flash('errors', errors);
      return res.redir('/analyze');
  }
  
  var urlToScrape = req.body.site;

  scraper.analyzeSite(urlToScrape, function(err, data) {
    var analysisData = JSON.parse(data);
    //console.log(imgList);
    // for (var prop in imgList) {
    //   //console.log('imgList.'+prop + ': '+imgList[prop]);
    //   console.log('prop: ' + prop);
    // }
    var humanReadablePageSize = filesize(
    parseInt(analysisData.pageStats.htmlResponseBytes) +
    parseInt(analysisData.pageStats.cssResponseBytes) +
    parseInt(analysisData.pageStats.imageResponseBytes) +
    parseInt(analysisData.pageStats.javascriptResponseBytes) +
    parseInt(analysisData.pageStats.otherResponseBytes));

    return res.render('analyze_results', {urlAnalyzed: urlToScrape,
      humanReadablePageSize: humanReadablePageSize,
      analysisData: analysisData});
    //res.render('analyze', {scrapedPages: imgList});
  });

  //res.json(data);


  // scraper.scrapeSite(urlToScrape, 10, function(err, imgList) {
  //   console.log("Done!");
  //   res.json(imgList);
  //   //res.render('analyze', {scrapedPages: imgList});
  // });

  // var rs = new Readable;
  // var index = 0;
  // rs.push(begin);
  // rs._read = function () {
  //     rs.push(JSON.stringifyObject(middle[index++]));
  //     if (index >= middle.length) {
  //         rs.push(end);
  //         rs.push(null);
  //     }
  // };
  // rs.pipe(process.stdout);
  // rs.pipe(res);
};