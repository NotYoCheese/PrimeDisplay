    //$(document).ready(function()
    //{
        for (var i = 0; i < _pdimgsrc.length; i++)
        {
            x.href = _pdimgsrc[i].src;
            if(x.hostname.indexOf('nla.com') != -1)
            {
                //var raw_url = encodeURIComponent(imgs[i].src);
                var raw_url = _pdimgsrc[i];
alert(raw_url);
                $.post("http://localhost:3000/image-stat/served/", {'raw_url' : raw_url})
                .fail(function(err)
                {
                    console.log(err);
                    alert("error");
                })
                .done(function(res)
                {
                });
            }
        }
    //});
