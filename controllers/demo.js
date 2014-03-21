/**
 * GET /demo
 * Demo page.
 */
"use strict"
var gm = require('gm');
var ResultX = 480
var effects = {
    blur: function(imagePath, response, im) {
        im(imagePath)
            .blur(30, 20)
            .resize(ResultX)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    implode: function(imagePath, response, im) {
        im(imagePath)
            .implode(-1.2)
            .resize(ResultX)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    contrast: function(imagePath, response, im) {
        im(imagePath)
            .contrast(-6)
            .resize(ResultX)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    colorize: function(imagePath, response, im) {
        im(imagePath)
            .colorize(200, 200, 256)
            .resize(ResultX)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    equalize: function(imagePath, response, im) {
        im(imagePath)
            .equalize()
            .resize(ResultX)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    sepia: function(imagePath, response, im) {
        im(imagePath)
            .sepia()
            .resize(ResultX)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    swirl: function(imagePath, response, im) {
        im(imagePath)
            .resize(ResultX)
            .region(101, 112, 90, 87)
            .swirl(200)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    rotate: function(imagePath, response, im) {
        im(imagePath)
            .rotate('green', -25)
            .resize(ResultX)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    rotateedge: function(imagePath, response, im) {
        im(imagePath)
            .rotate('green', -25)
            .edge(3)
            .resize(ResultX)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    fliprotateedge: function(imagePath, response, im) {
        im(imagePath)
            .flip()
            .rotate('green', -25)
            .edge(3)
            .resize(ResultX)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    }
};

exports.getDemo = function(req, res) {
    var effect = req.params.effect;
    var imgPath = '/img/sample.jpg';
    if (effect != undefined) {
        var imageMagick = gm.subClass({ imageMagick: true });
        effects[effect]('public' + imgPath, res, imageMagick);
    } else {
        res.render('demo', {
            title : 'Demo',
            imagePath: imgPath
        });
    }
};



