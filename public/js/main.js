
$(document).ready(function() {
});

//Enable pusher logging - don't include this in production
//var Pusher = require('pusher');

Pusher.log = function(message)
{
	if (window.console && window.console.log) {
		window.console.log(message);
	}
};

var pusher = new Pusher('a249e105003602fad09c');
var channel = pusher.subscribe('primedisplay');
channel.bind('primedisplay_monitor', function(data)
{
	//alert(data.message);
	html = document.getElementById("status_data").innerHTML;
	document.getElementById("status_data").innerHTML = html + "<br>>" + data.message;
});
