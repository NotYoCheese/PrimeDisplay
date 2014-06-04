/**
 * GET|PUT /image-stat
 * 
 * retrieve or increment image stats
 */

var ImageStat = require('../models/image-stat');

exports.getImageStat = function(req, res)
{
    if (req.user === undefined) {
        req.flash('errors', {msg: 'You must be logged in to use this feature'});
        res.redirect('/login');
        return;
    }
	var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
	var perPage = 10
	var options = {
		perPage: perPage,
		page: page,
		criteria: {'user': req.user._id}
	}

	ImageStat.list(options, function(err, results)
	{
		if (err) return res.render('500');
		ImageStat.count(options.criteria).exec(function (err, count)
		{
			res.render('image-stat',
			{
				_pd_allImages: results,
				page: page + 1,
				pages: Math.ceil(count / perPage),
	createPagination: function (pages, page) {
		var url = require('url')
		, qs = require('querystring')
		, params = qs.parse(url.parse(req.url).query)
		, str = '<ul class="pagination">'

		params.page = 0
		var clas = page == 0 ? "active" : "no"
		str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">First</a></li>'
		for (var p = 1; p <= pages; p++)
		{
			params.page = p
			clas = page == p ? "active" : "no"
			str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">' +  p  + '</a></li>'
		}
		params.page = --p
		clas = page == params.page ? "active" : "no"
		str += '<li class="' + clas + '"><a href="?' + qs.stringify(params) + '">Last</a></li></ul>'

		return str
	}
			});
		});
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
            var pdServeURL = '';
            if(req.body.raw_url.indexOf('http://') == 0)
            {
                pdServeURL = 'http://' + GLOBAL.pd_img_website + '/' + req.body._pdAccount + '/wid/hi/u' + req.body.raw_url.substr(6);
            }
            else if(req.body.raw_url.indexOf('https://') == 0)
            {
                pdServeURL = 'https://' + GLOBAL.pd_img_website + '/' + req.body._pdAccount + '/wid/hi/u' + req.body.raw_url.substr(7);
            }
            else
            {
                pdServeURL = 'http://' + GLOBAL.pd_img_website + '/' + req.body._pdAccount + '/wid/hi/u' + req.body.raw_url;
            }
            if(result == null) {
                result = new ImageStat({'user': req.body._pdAccount, 'user_domain': req.body._pdDomain, 'raw_url': req.body.raw_url, 'impressions': 1, 'serve_url': pdServeURL});
                isNew = true;
            } else {
console.log('MAH saving');
		result.serve_url = pdServeURL;
                result.impressions++;
            }
            result.save(function(err) {
              if(err)
              {
                console.log(err);
              }
            });

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

