/**
 * GET|PUT /image-stat
 * 
 * retrieve or increment image stats
 */

var ImageStat = require('../models/image-stat');

exports.getImageStat = function(req, res)
{
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

exports.getImageStatAdd = function(req, res)
{
        ImageStat.findOne({'raw_url': req.query.raw_url}, function(err, result)
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
                                result = new ImageStat({'raw_url': req.query.raw_url, 'impressions': 1, 'user' : req.query.user_id});
				isNew = true;
                        }
                        else
                        {
                                result.impressions++;
                        }
			result.save();
			ImageStat.findOne({'raw_url': req.query.raw_url}, function(err, check)
			{
				if(check == null)
				{
console.log("WTF");
				}
			});
                        res.send({result: result, isNew: isNew});
                }
        });
};
