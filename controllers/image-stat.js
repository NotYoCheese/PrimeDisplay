/**
 * GET|PUT /image-stat
 * 
 * retrieve or increment image stats
 */

var ImageStat = require('../models/image-stat');

exports.getImageStat = function(req, res)
{
	//res.render('image-stat', { title: 'Image Stat' });

        ImageStat.find({'client': req.params.client, 'image': req.params.image}, function(err, result)
        {
                if (err)
                {
                        res.status(500);
                        res.send(err);
                }
                else
                {
                        res
			.set('_csrf', res.locals._csrf)
			.send({result: result});
                }
        });
};

exports.getImageStatServed = function(req, res)
{
	res.render('image-stat-served');
};

exports.postImageStat = function(req, res)
{
        ImageStat.findOne({'client': req.params.client, 'image': req.params.image}, function(err, result)
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
                                result = new ImageStat({'client': req.params.client, 'image': req.params.image, 'impressions': 1});
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
