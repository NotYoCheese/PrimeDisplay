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

exports.postAnalyze = function(req, res) {
    var imgList,
        errors;
    req.assert('site', 'Please enter a valid URL').notEmpty();

    errors = req.validationErrors();


    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/analyze');
    }
    var urlToScrape = req.body.site;
    imgList = { page: 'http://localhost:3000/auth/linkedin',
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
     'https://secure-us.imrworldwide.com/cgi-bin/m?ci=us-603751h&cg=0&cc=1&ts=noscript' ] };

    res.render('analyze', {imgList: imgList,
        urlToScrape: urlToScrape});
};