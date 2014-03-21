
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

var handleImageDemoClick = function() {
    console.log("button id: " + this.id);
    var url = '/demo/' + this.id;
    $.ajax({
        url: url,
        cache: false,
        timeout: 30000,
        success: function(data) {
            $('#imgToReplace').attr("src", "data:image/jpeg;base64," + data).show();
            $('#imgToReplace').show();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error: " + textStatus);
        }
    });
};

var handleAnalyzeClick = function() {
    var urlToScrape = $('#site').text;
    var url = '/analyze';
    $.ajax({
        url: url,
        cache: false,
        timeout: 30000,
        type: post,
        success: function(data) {
            $('#imgLIst').text = data;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error: " + textStatus);
        }
    });
};

function prepareEventHandlers() {
    $("#btns > a.btn").click(handleImageDemoClick);
//    $("#analyzeBtn").click(handleAnalyzeClick);
}


$(document).ready(function() {
    $('#imgToReplace').hide(0);
    prepareEventHandlers();
});
