'use strict';
var request = require('request');
var cheerio = require('cheerio');
var events = require('events');
var url = require('url');
var async = require('async');

var ImageScraper = function () {
    this.data = {
        maxPages: 1,
        visitedUrls: [],
        imageList: [],
        urlsToScrape: [],
        eventEmitter: undefined,
        completion: undefined
    };

    this.processImage = function(parentUrl, pageMap, $) {
        return function(index, element) {
            if ($(element).attr("src") !== undefined) {
                //console.log("img src: " + $(element).attr("src"));
                var parsedImgURL = url.parse(url.resolve(parentUrl, ($(element).attr("src"))));
                pageMap.imgList.push(parsedImgURL.href);
            }
        };
    };

    this.processLink = function(self, parentUrl, $) {
        return function(index, element) {
            var parsedSubUrl = url.parse(url.resolve(parentUrl, $(element).attr("href")));
            
            if ((parsedSubUrl.hostname == parentUrl.hostname) 
            && (self.data.visitedUrls.indexOf(parsedSubUrl.href) == -1)
            && (self.data.visitedUrls.length < self.data.maxPages) ) {
                self.data.urlsToScrape.push(parsedSubUrl.href);
            }
        };
    };

    this.goodImageTag = function($){
        return function(item, callback) {
            var goodLink = ($(item).attr("src") !== undefined);
            callback(goodLink);
        };
    };

    this.processScrapedPage = function(self, parentUrl) {
        return function(err, response, body) {
            //console.log(response.request.uri.href);
            if (err) {
                // TODO: emit error and return to client, or just 
                // skip page.
                console.log(parentUrl.href + ": " + err);
            } else if (response.statusCode == 200) {
                var $ = cheerio.load(body);
                var pageMap = {page: parentUrl.href, imgList: []};
                $('img[src]').each(self.processImage(parentUrl, pageMap, $));
                if (pageMap.imgList.length > 0) {
                    self.data.imageList.push(pageMap);
                }
                //var anchorTags = $('a[href]');
                //console.log('anchor tag count: ' + anchorTags.length);
                $('a[href]').each(self.processLink(self, parentUrl, $));
            } else {
                console.log('non-200 response code: ' + response.statusCode);
            }
            self.data.eventEmitter.emit('scrapeDone', self);
        };
    };

    this.scrape = function(self) {
        if ((self.data.urlsToScrape.length > 0) 
         && (self.data.visitedUrls.length < self.data.maxPages)) {
            var urlToScrape = self.data.urlsToScrape.pop();
            console.log('Walkin: ' + urlToScrape);
            if (self.data.visitedUrls.indexOf(urlToScrape) == -1) {
                self.data.visitedUrls.push(urlToScrape);
            
                var parentUrl = url.parse(urlToScrape);
                var req = {
                    uri : urlToScrape,
                    timeout : 50000,
                    headers : {
                        'User-Agent' : 'Mozilla/5.0 (compatible; PrimeDisplay)'
                    }
                };
                
                request(req, self.processScrapedPage(self, parentUrl));
            } else {
                console.log('calling completion - inner');
                self.data.completion(undefined, self.data.imageList);
            }
        } else {
            console.log('calling completion - outter');
            self.data.completion(undefined, self.data.imageList);
        }
    };

    this.scrapeSite = function(urlToScrape, maxPages, completion) {
        console.dir (this);
        if (maxPages !== undefined) {
            this.data.maxPages = maxPages;
        }
        this.data.eventEmitter = new events.EventEmitter();
        this.data.eventEmitter.on('scrapeDone', this.scrape);
        this.data.urlsToScrape.push(urlToScrape);
        this.data.completion = completion;
        this.scrape(this);
    };

    this.analyzeSite = function(urlToScrape, completion) {
        var googleUrl = "https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=" +
        urlToScrape + 
        "&key=AIzaSyAOvKPPQgN53SbANdmkXYo4Lqi0FEzetfs";
        var req = {
            uri : googleUrl,
            timeout : 50000,
            headers : {
                'User-Agent' : 'Mozilla/5.0 (compatible; PrimeDisplay)'
            }
        };

        request(req, function(err, response, body) {
            completion(err, body);
        });
    };

    return this;
};

exports.create = function() {
    var scraper = new ImageScraper();
    return scraper;
}

exports.scrape = function(urlToScrape, numPages, callback) {
    console.log('exports.scrape');
    this.scrapeSite(urlToScrape, numPages, callback);
}
