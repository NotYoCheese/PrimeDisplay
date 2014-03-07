
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


    ;(function(){
      var form = $('form')
        , select = $('form')
        , options = select.find('option')
        , wrap = $('#frame-wrap')
        , loader = wrap.find('> img')
        , exampleCode = $("#example code");

      var btns = $('<div id="btns"/>');

      options.each(function (_, option) {
        var o = $(option)
        var txt = o.text()
          , id = o.val()
        btns.append("<button type='button' id="+id+">" + txt + "</button>");
      });

      btns.insertAfter("#example-wrap");

      form.remove();
      wrap.find('iframe').remove();

      var preview = $('<div style="background: transparent url(/img/nodejs.png) no-repeat;">')
      wrap.prepend(preview);

      btns.on('click', 'button', function (e) {
        e.preventDefault();
        e.stopPropagation();

        preview.stop(true, true).fadeTo(400, '0.7');

        var btn = $(e.target);
        var code = $("#raw-code code[data-code='" + e.target.id + "']").text();
        exampleCode.text(code);

        var url = 'http://freezing-spring-5684.herokuapp.com/?op='
                + e.target.id

        var img = new Image;
        img.onload = function () {
          preview.css('background-image', 'url('+url+')' );
          preview.stop(true, true);
          preview.fadeTo(120, '1.0');
        }
        img.src = url;
      });

    })();
  