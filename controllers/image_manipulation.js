var secrets = require('../config/secrets');
var request = require('request');

/**
 * POST /api/aviary
 * Save Aviary modified image back to PD
 */

exports.postAviary = function(req, res, next) {
  console.log(req.body);

  var saveUrlData =
  {
    user: req.body.user, //MongoLab User table ID
    xReplace: req.body.urlToReplace,
    editedUrl:  req.body.editedUrl,
    sharedSecret: secrets.primeDisplay.imageSaveSecret
  };

  var saveUrlDataString  = JSON.stringify(saveUrlData);

  var headers = {
    'Content-Type': 'application/json',
    'Content-Length': saveUrlDataString.length
  };

  var options = {
    uri: 'http://pd.nla.com/saveurl',
    method: 'POST',
    timeout: 3000,
    headers: headers,
    body: saveUrlDataString
  };

  var sendSaveResponse = function(response, result, message) {
    var resultJSON = {
      result: result,
      message: message
    };
    response.json(resultJSON);

  };

  request(options, function(err, response, body) {
    if (err != null) {
      req.flash('errors', { msg: 'Image not saved to PrimeDisplay: '+err});
      console.log('image save error: '+err);
      console.dir(err);
      sendSaveResponse(res, 'error', err);
    } else {
      //console.log('response: ' + JSON.stringify(response));
      console.log('body:' + JSON.stringify(body));
      console.log('statusCode: ' + response.statusCode);
      if ((response.statusCode >= 200) && (response.statusCode < 299)) {
        sendSaveResponse(res, 'success', 'Your image has been saved successfully.', err);
        console.log('success');
      } else {
        sendSaveResponse(res, 'error', 'Image not saved to PrimeDisplay: status code ' 
          + response.statusCode, err);
        console.log('error');
      }
    }
  });
};