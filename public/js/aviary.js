

function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    console.log('calling form.submit()');
    form.submit();
}

var featherEditor = new Aviary.Feather({
	apiKey: 'c83c98c0da041785',
	apiVersion: 3,
	theme: 'dark',
	tools: 'all',
	appendTo: '',
    onSave: function(imageID, newURL) {
        console.log('new Url: \''+newURL+'\'');
		$('#'+imageID).attr('src', newURL);
        params = {
            _csrf:$('#_csrf').attr('value'),
            urlToReplace: $('#'+imageID).attr('data-rawurl'),
            editedUrl: newURL,
            user: $('#user').attr('value'),
        };
        console.log('calling post_to_url');
        post_to_url('/api/aviary', params);
	},
	onError: function(errorObj) {
		alert(errorObj.message);
	}
});

var launchEditor = function(event) {
    console.log('launching editor');
	featherEditor.launch({
		image: event.data.pdImage._id,
		url: event.data.pdImage.raw_url
	});
	return false;
};