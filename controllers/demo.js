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

exports.getDemo = function(req, res) {
    var effect = req.params.effect;
    console.log("req: ");
    console.dir(req.params);
    console.log("effect: " + effect);
    var imgPath = '/img/nodejs.png';
    if (effect == "blur") {
        blur();
        imgPath = '/img/nodejs2.png';
    }
    res.render('demo', {
        title : 'Demo',
        imagePath: imgPath
    });
};



