"use strict";
/**
 * GET /analyze
 * Analyze page.
 */

exports.getAnalyze = function(req, res) {
    res.render('analyze', {
        title : 'Analyze'
    });
};
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
    var scrapeList,
        errors;
    req.assert('site', 'Please enter a valid URL').notEmpty();
    console.log(req);
    console.log(res);
    errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/analyze');
    }
    console.log("returning data");
    var urlToScrape = req.body.site;
    res.json(data);
};