

var alertClasses = {
  'notice': 'alert-info',
  'success': 'alert-success',
  'error': 'alert-error'
}

var showAlert = function(type, message) {

  type = type || "notice";
  console.log('type: '+ type);
  console.log('class: ' + alertClasses[type]);
  var alert = $('<div class="alert ' + alertClasses[type] + ' animated fadeIn">'
    + '<button type="button" data-dismiss="alert" class="close">×</button>'
    + '<div>' + message + '</div></div>');

  $('#flash').append(alert);

};

var updatePDServer = function(path, params, method) {
  method = method || "post"; // Set method to post by default if not specified.
  //var data = JSON.stringify(params);
  var data = params;

  var request = $.ajax({
    url: '/api/aviary',
    method: method,
    timeout: 3000,
    data: data
  });
  // callback handler that will be called on success
  request.done(function (response, textStatus, jqXHR){
      // log a message to the console
      console.log("textStatus: " + textStatus);
      console.log("jqXHR: ");
      console.dir(jqXHR);
      if (jqXHR.responseJSON.result === 'error') {
        showAlert('error', jqXHR.responseJSON.message);
      } else {
        showAlert('success', 'Image Saved!');
      }

  });

  // callback handler that will be called on failure
  request.fail(function (jqXHR, textStatus, errorThrown){
      // log the error to the console
      showAlert('error', textStatus);
      
      console.error(
          "The following error occured: "+
          textStatus, errorThrown
      );
  });

  // callback handler that will be called regardless
  // if the request failed or succeeded
  request.always(function () {
      // reenable the inputs
      console.log('all done.')
  });
};

var featherEditor = new Aviary.Feather({
  apiKey: 'c83c98c0da041785',
  apiVersion: 3,
  theme: 'dark',
  tools: 'all',
  appendTo: '',
  onSave: function(imageID, newURL) {
    console.log('new Url: \''+newURL+'\'');
    $('#'+imageID).attr('src', newURL);
    var params = {
      _csrf:$('#_csrf').attr('value'),
      urlToReplace: $('#'+imageID).attr('data-rawurl'),
      editedUrl: newURL,
      user: $('#user').attr('value'),
    };
    console.log('calling updatePDServer');
    updatePDServer('/api/aviary', params);
  },
  onError: function(errorObj) {
    alert(errorObj.message);
  }
});

var launchEditor = function(event) {
  tmpUrl = event.data.pdImage.raw_url.replace('10.10.1.108', 'direct.coinsociety.com');
  console.log('launching editor');
  featherEditor.launch({
    image: event.data.pdImage._id,
    url: tmpUrl
  });
  return false;
};