/**
 * GET|PUT /image-stat
 * 
 * retrieve or increment image stats
 */

 var ImageStat = require('../models/image-stat');

 exports.getImageStat = function(req, res) {
    ImageStat
    .find()
    .exec(function(err, results) {
        if (err) {
            res.status(500);
            res.send(err);
        } else  {
            res.render('image-stat', {_pd_allImages: results});
        }
    });
};

exports.getImageStatServed = function(req, res) {
	res.render('image-stat-served');
};

exports.postImageStatAdd = function(req, res) {
    ImageStat.findOne({'user': req.body._pdAccount, 
        'user_domain': req.body._pdDomain, 
        'raw_url': req.body.raw_url}, function(err, result) {
        if (err) {
            res.status(500);
            res.send(err);
        } else {
            var isNew = false;
            if(result == null) {
                result = new ImageStat({'user': req.body._pdAccount, 'user_domain': req.body._pdDomain, 'raw_url': req.body.raw_url, 'impressions': 1});
                isNew = true;
            } else {
                result.impressions++;
            }
            result.save();
            /* NOTE: The following function is here for testing and showing that we are always saving data. However,
            as the save is async the second find could find nothing even though things are working. */
            setTimeout(function() {
                ImageStat.findOne({'user': req.body._pdAccount, 
                    'user_domain': req.body._pdDomain,
                    'raw_url': req.body.raw_url}, function(err, check) {
                    if(check == null) {
                        console.log("WTF");
                        console.log("{'user': " + req.body._pdAccount + ", 'user_domain': " + req.body._pdDomain + ", 'raw_url': " + req.body.raw_url + ", 'impressions': 1}");
                    } else {
                        /* console.log("Saved"); */
                        /* console.log(check); */
                    }
                });
            }, 1000);
            res.send({result: result, isNew: isNew});
        }
    });
};

