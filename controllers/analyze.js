/**
 * GET /analyze
 * Analyze page.
 */

exports.getAbout = function(req, res) {
  res.render('analyze', {
    title: 'Analyze'
  });
};
