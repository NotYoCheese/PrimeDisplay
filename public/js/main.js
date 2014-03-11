
$(document).ready(function() {
});

//Enable pusher logging - don't include this in production
//var Pusher = require('pusher');

//Pusher.log = function(message)
//{
//	if (window.console && window.console.log) {
//		window.console.log(message);
//	}
//};

var pusher = new Pusher('a249e105003602fad09c');
var channel = pusher.subscribe('primedisplay');
channel.bind('primedisplay_monitor', function(data)
{
	//alert(data.message);
    element = document.getElementById("status_data");
    if (element) {
    	html = element.innerHTML;
    	element.innerHTML = html + "<br>>" + data.message;
    }
});

function prepareEventHandlers() {
    $("#btns > button").click(function() {
        console.log("button id: " + this.id);
        var url = '/demo/' + this.id;
        $.ajax({
            url: url,
            cache: false,
            timeout: 5000,
            success: function(data) {
                $('#imgToReplace').attr("src", "data:image/png;base64," + data).show();
                $('#imgToReplace').show();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("error: " + textStatus);
            }
        });
    });
}


$(document).ready(function() {
    $('#imgToReplace').hide(0);
    prepareEventHandlers();
});
