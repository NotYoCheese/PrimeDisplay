"use strict";

var Readable = require('stream').Readable;
var Scraper = require('../models/scraper')


/**
 * GET /analyze
 * Analyze page.
 */

exports.getAnalyze = function(req, res) {
    res.render('analyze', {
        title : 'Analyze'
    });
};
var begin = ' { "scrapedPages" : [';
var end = ' ] }';

var middle =  [ { page: 'http://localhost:3000/demo',
    imgList: [ 'http://localhost:3000/img/sample.jpg' ] },
  { page: 'http://localhost:3000/api/aviary',
    imgList: [ 'http://i.imgur.com/fM7OHvr.png' ] },
  { page: 'http://localhost:3000/demo#',
    imgList: [ 'http://localhost:3000/img/sample.jpg' ] },
  { page: 'http://localhost:3000/api/scraping',
    imgList: [ 'http://localhost:3000/img/hacker_news.png' ] },
  { page: 'http://localhost:3000/auth/google',
    imgList: 
     [ 'http://ssl.gstatic.com/accounts/ui/logo_2x.png',
       'http://ssl.gstatic.com/accounts/ui/avatar_2x.png',
       'http://ssl.gstatic.com/accounts/ui/logo_strip_2x.png' ] },
  { page: 'http://localhost:3000/auth/linkedin',
    imgList: 
     [ 'https://static.licdn.com/scds/common/u/img/logos/logo_132x32_2.png',
       'https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_1_150x150_v1.png',
       'https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_2_150x150_v1.png',
       'https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_3_150x150_v1.png',
       'https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_4_150x150_v1.png',
       'https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_5_150x150_v1.png',
       'https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_6_150x150_v1.png',
       'https://secure.quantserve.com/pixel/p-b3sGjMtCFrexE.gif',
       'https://sb.scorecardresearch.com/b?c1=2&c2=6402952&c3=&c4=&c5=&c6=&c15=&cv=1.3&cj=1',
       'https://secure-us.imrworldwide.com/cgi-bin/m?ci=us-603751h&cg=0&cc=1&ts=noscript' ] } 
];

var data ={
 "scrapedPages" :  
 [ { page: 'http://localhost:3000/demo',
    imgList: [ 'http://localhost:3000/img/sample.jpg' ] },
  { page: 'http://localhost:3000/api/aviary',
    imgList: [ 'http://i.imgur.com/fM7OHvr.png' ] },
  { page: 'http://localhost:3000/demo#',
    imgList: [ 'http://localhost:3000/img/sample.jpg' ] },
  { page: 'http://localhost:3000/api/scraping',
    imgList: [ 'http://localhost:3000/img/hacker_news.png' ] },
  { page: 'http://localhost:3000/auth/google',
    imgList: 
     [ 'http://ssl.gstatic.com/accounts/ui/logo_2x.png',
       'http://ssl.gstatic.com/accounts/ui/avatar_2x.png',
       'http://ssl.gstatic.com/accounts/ui/logo_strip_2x.png' ] },
  { page: 'http://localhost:3000/auth/linkedin',
    imgList: 
     [ 'https://static.licdn.com/scds/common/u/img/logos/logo_132x32_2.png',
       'https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_1_150x150_v1.png',
       'https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_2_150x150_v1.png',
       'https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_3_150x150_v1.png',
       'https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_4_150x150_v1.png',
       'https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_5_150x150_v1.png',
       'https://static.licdn.com/scds/common/u/images/apps/home/guesthome/ghp_international_6_150x150_v1.png',
       'https://secure.quantserve.com/pixel/p-b3sGjMtCFrexE.gif',
       'https://sb.scorecardresearch.com/b?c1=2&c2=6402952&c3=&c4=&c5=&c6=&c15=&cv=1.3&cj=1',
       'https://secure-us.imrworldwide.com/cgi-bin/m?ci=us-603751h&cg=0&cc=1&ts=noscript' ] } 
]};

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
  console.log("returning data");
  var urlToScrape = req.body.site;

  scraper.analyzeSite(urlToScrape, function(err, data) {
    var analysisData = JSON.parse(data);
    //console.log(imgList);
    // for (var prop in imgList) {
    //   //console.log('imgList.'+prop + ': '+imgList[prop]);
    //   console.log('prop: ' + prop);
    // }
    console.log("Done. Score: " + analysisData.score);
    return res.render('analyze_results', {analysisData: analysisData});
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