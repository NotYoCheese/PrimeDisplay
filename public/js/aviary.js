
var imgClickHandler = function(event) {
    alert(event.data.pdImage._id);
};
var featherEditor = new Aviary.Feather({
	apiKey: 'c83c98c0da041785',
	apiVersion: 3,
	theme: 'dark',
	tools: 'all',
	appendTo: '',
	onSave: function(imageID, newURL) {
		var img = document.getElementById(imageID);
		img.src = newURL;
	},
	onError: function(errorObj) {
		alert(errorObj.message);
	}
});
var launchEditor = function(event) {
	featherEditor.launch({
		image: event.data.pdImage._id,
		url: event.data.pdImage.raw_url
	});
	return false;
};