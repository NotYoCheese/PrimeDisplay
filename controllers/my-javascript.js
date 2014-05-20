exports.getMyJavaScript = function(req, res)
{
        res.render('my-javascript', {_pd_host: GLOBAL.pd_dev_website});
};
