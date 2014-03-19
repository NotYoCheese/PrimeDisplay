/**
 * GET /analyze
 * Analyze page.
 */

exports.getAnalyze = function(req, res) {
  res.render('analyze', {
    title: 'Analyze'
  });
};

exports.postAnalyze = function(req, res) {
  req.assert('site', 'Please enter a valid URL').notEmpty();
    
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/analyze');
  }

  res.redirect('/analyze');
};