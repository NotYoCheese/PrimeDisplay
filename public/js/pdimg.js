
function include(filename, onload)
{
	if(!window.jQuery)
	{
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.src = filename;
		script.type = 'text/javascript';
		script.onload = script.onreadystatechange = function()
		{
			if (script.readyState)
			{
				if (script.readyState === 'complete' || script.readyState === 'loaded')
				{
					script.onreadystatechange = null;                                                  
					onload();
				}
			} 
			else
			{
				onload();          
			}
		};
		head.appendChild(script);
	}
	else
	{
		onload();
	}
}

include('http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js', function() {
    $(document).ready(function() {
        _pd_save_stats();
    });
});

function _pd_save_stats()
{
	for (var i = 0; i < _pdimgsrc.length; i++)
	{
		x.href = _pdimgsrc[i].src;
		var raw_url = _pdimgsrc[i];
		$.ajax({
			url: 'http://localhost:3000/image-stat/add',
			type: 'GET',
			dataType: 'html',
			// context: document.body,
			xhrFields: { withCredentials: false },
			data: {'raw_url' : raw_url, '_pdAccount' : _pd['_pdAccount']},
			success: function()
			{
				alert('success');
			},
			error: function(err)
			{
				alert('error');
				console.log(err);
			}
		});
	}
}

function XX_pd_save_stats()
{
	for (var i = 0; i < _pdimgsrc.length; i++)
	{
		x.href = _pdimgsrc[i].src;
		var raw_url = _pdimgsrc[i];
		$.get("http://localhost:3000/image-stat/served/")
		.done(function(res)
		{
			var parser = new DOMParser()
			  , doc = parser.parseFromString(res, "text/html");
			var myForm = doc.getElementById('pdisform');

			myForm.raw_url.value = raw_url;
			myForm.user_id.value = _pd['_pdAccount'];
			sendData(myForm);
			//myForm.submit();

		/*
			var form = document.createElement('form');

			var fe_raw_url = document.createElement('input');
			fe_raw_url.name = 'raw_url';
			fe_raw_url.value = raw_url;
			form.appendChild(fe_raw_url);

			var fe_user_id = document.createElement('input');
			fe_user_id.name = 'user_id';
			fe_user_id.value = _pd['_pdAccount'];
			form.appendChild(fe_user_id);

			var fe_csrf = document.createElement('input');
			fe_csrf.name = '_csrf';
			fe_csrf.value = myForm._csrf.value;
			form.appendChild(fe_csrf);

			sendData(form);

			$.post("http://localhost:3000/image-stat/served/", {'raw_url' : raw_url, '_pdAccount' : _pd['_pdAccount']})
			.fail(function(err)
			{
				console.log(err);
				alert("error");
			})
			.done(function(res)
			{
			});
		*/
		});
	}
}
