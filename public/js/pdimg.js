
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
			url: 'http://enigmatic-beach-1528.herokuapp.com/image-stat/add',
			type: 'POST',
			dataType: 'html',
			// context: document.body,
			xhrFields: { withCredentials: false },
			data: {'raw_url' : raw_url, '_pdAccount' : _pd['_pdAccount']},
			success: function()
			{
				/* alert('success'); */
			},
			error: function(err)
			{
				console.log(err);
			}
		});
	}
}
