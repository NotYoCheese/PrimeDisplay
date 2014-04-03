/**
 * GET|PUT /image-stat
 * 
 * retrieve or increment image stats
 */

var ImageStat = require('../models/image-stat');

exports.getImageStat = function(req, res)
{
	//res.render('image-stat');
        ImageStat
	.find()
	.exec(function(err, results)
        {
                if (err)
                {
                        res.status(500);
                        res.send(err);
                }
                else
                {
                        res.render('image-stat', {_pd_allImages: results});
                }
        });
};

exports.getImageStatServed = function(req, res)
{
	res.render('image-stat-served');
};

exports.postImageStatServed = function(req, res)
{
        ImageStat.findOne({'raw_url': req.body.raw_url}, function(err, result)
        {
                if (err)
                {
                        res.status(500);
                        res.send(err);
                }
                else
                {
			var isNew = false;
                        if(result == null)
                        {
                                result = new ImageStat({'raw_url': req.body.raw_url, 'impressions': 1});
                                result.save();
				isNew = true;
                        }
                        else
                        {
                                result.impressions++;
                                result.save();
                        }
                        res.send({result: result, isNew: isNew});
                }
        });
};
