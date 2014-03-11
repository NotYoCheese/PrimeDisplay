/**
 * GET /demo
 * Demo page.
 */
var gm = require('gm');

function blur() {
    var imageMagick = gm.subClass({ imageMagick: true });
    console.log("im object: ");
    console.dir(imageMagick);
    imageMagick('public/img/nodejs.png')
        .blur(30, 20)
        .resize(353, 257)
        .autoOrient()
        .write('public/img/nodejs2.png', function (err) {
          if (err) {
              console.log("error:  " + err);
          }
        });
}
function writeImageToResponse(err, buffer) {
    var img = new Buffer(buffer, 'binary').toString('base64');
    response.send(img);
}

var effects = {
    blur: function(imagePath, response, im) {
        im(imagePath)
            .blur(30, 20)
            .resize(353, 257)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    implode: function(imagePath, response, im) {
        im(imagePath)
            .implode(-1.2)
            .resize(353, 257)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    contrast: function(imagePath, response, im) {
        im(imagePath)
            .contrast(-6)
            .resize(353, 257)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    colorize: function(imagePath, response, im) {
        im(imagePath)
            .colorize(200, 200, 256)
            .resize(353, 257)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    equalize: function(imagePath, response, im) {
        im(imagePath)
            .equalize()
            .resize(353, 257)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    sepia: function(imagePath, response, im) {
        im(imagePath)
            .sepia()
            .resize(353, 257)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    },
    swirl: function(imagePath, response, im) {
        im(imagePath)
            .resize(353, 257)
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
            .resize(353, 257)
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
            .resize(353, 257)
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
            .resize(353, 257)
            .autoOrient()
            .toBuffer(function(err, buffer) {
                var img = new Buffer(buffer, 'binary').toString('base64');
                response.send(img);
            });        
    }
};

exports.getDemo = function(req, res) {
    var effect = req.params.effect;
    console.log("req: ");
    console.dir(req.params);
    console.log("effect: " + effect);
    var imgPath = '/img/nodejs.png';
    if (effect != undefined) {
        console.log("writin img");
        var imageMagick = gm.subClass({ imageMagick: true });
        effects[effect]('public' + imgPath, res, imageMagick);
    } else {
        res.render('demo', {
            title : 'Demo',
            imagePath: imgPath
        });
    }
};



