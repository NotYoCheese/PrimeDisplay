var server_port = 80;
var num_images_served = 0;
var num_bytes_served = 0;
var request_count = 0;

secrets     = require('./config/secrets'),

http        = require('http'),
path        = require('path'),
fs          = require('fs'),
mkdirp      = require('mkdirp'),
Pusher      = require('node-pusher'),
request     = require("request"),

pusher = new Pusher
({
    appId: secrets.pusher_app_id,
    key:   secrets.pusher_app_key,
    secret: secrets.pusher_app_secret
}),

//these are the only file types we will support for now
 extensions = {
    ".png" : "image/png",
    ".svg" : "image/svg+xml",
    ".gif" : "image/gif",
    ".jpg" : "image/jpeg"
};

/* ****************************************************************************** */
// create the server and listen
/* ****************************************************************************** */
http.createServer(requestHandler).listen(server_port);
console.log("\n>>> PrimeDisplay Image Server is now listening on port " + server_port + "...\n");
/* -- fin -- */

/* ****************************************************************************** */
//a helper function to handle HTTP requests
/* ****************************************************************************** */
function requestHandler(req, res)
{
    request_count++;
    console.log("\n==>" +  request_count + " Request Handler: " + req.url);

    if (req.url === "/")
    {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("<html><head></head><body>Yes?  Can I help you?</body></html>");
    }
    else if (req.url === "/status")
    {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("<html><head></head><body><h1>Up and running.</H1></body></html>");
    }
    else if (req.url === "/stats")
    {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("<html><head></head><body>No stats are available, but thanks for asking.</body></html>");
    }
    else if (req.url === "/saveurl")
    {
        res.end("this is a test");
        //respondToSaveURL(req,res);
        console.log("\n GOT /saveurl ");
    }
    else
    {
        if (req.url.indexOf("/u/") < 1)
        {
            res.writeHead(404, {'Content-Type': 'text/html'});
            console.log("\n Bad /u/ not found[" + req.url + "]\n");

            res.end("<html><head></head><body>Bad /u/ not found[" + req.url + "]</body></html>");
        }
        else
        {
            //do we support the requested file type?
            var ext = path.extname(req.url);
            if(!extensions[ext])
            {
                //for now just send a 404 and a short message
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end("<html><head></head><body>The requested file type is not supported</body></html>");
            }
            else
            {
                //call our helper function
                //pass in the path to the file we want,
                //the response object, and the 404 page path
                //in case the requestd file is not found
                serveFile(req,res,extensions[ext]);
            }
        }
    }
};
/* ****************************************************************************** */
//helper function handles file verification
/* ****************************************************************************** */
function serveFile(req,res,mimeType)
{
    var localPath = buildLocalFilepath(req.url);

    //does the requested file exist?
    fs.exists(localPath,function(exists)
    {
        //
        //if we can, pull it from cache and spit out the image bytes
        //
        // todo:  there is no TTL currently implemented
        //
        if(exists)
        {
            spit_image(req,localPath,res,mimeType);
        }
        //
        // else it was not cached so
        //   1) Create a folder for it if needed
        //   2) Copy the file into the folder
        //   3) Spit out the image bytes
        //
        else
        {
            var local_folder = getFolderFromFilePath( localPath );
            mkdirp((local_folder), function(err)
            {
                url = req.url.substr(1);  //get rid of leading slash
                var first_slash_position = url.indexOf("/u/");
                var url2 = url.substr(  first_slash_position + 3 );

                var pull_file_from = "http://" + url2;
                request( pull_file_from ).pipe(fs.createWriteStream(localPath))
                .on('end', function ()
                {
                    spit_image(req,localPath,res,mimeType);      //read the fiule, run the anonymous function
                    console.log("\nCached it!:[" + pull_file_from + "][" +url + "]\n");
                })
                .on('error', function(e)
                {
                    console.log("\nGET request error for:" +   pull_file_from   );
                    console.log("\nGot error: " + e.message);
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end("<html><head></head><body>Error</body></html>");
                });
                console.log("\nIts Going");
            });
        }
    });
};
/* ****************************************************************************** */
/* ****************************************************************************** */
/* ****************************************************************************** */
function spit_image(req,filePath,res,mimeType)
{
     //read the file, run the anonymous function
    fs.readFile(filePath,function(err,contents)
    {
        if(!err)
        {
            var bUseBrowserCache = false;
            if (req.headers['cache-control'] == "max-age=0")
                bUseBrowserCache = true;

            bUseBrowserCache = false; // till we get the 304 working
            if ( bUseBrowserCache)
            {
                // this should return a 304
            }
            else
            {
                if (contents.length < 1)
                {
                    console.log("\n ERROR: EMPTY IMAGE.");
                }
                res.writeHead(200,
                {
                    "Content-type" : mimeType,
                    "Content-Length" : contents.length
                });
                res.end(contents);
		        num_images_served++;
                num_bytes_served = num_bytes_served + Math.round(contents.length/1024);
                console.log("\nServed it!:" +  num_images_served + "/" + num_bytes_served + "K [" + filePath + "]\n");
  	            pusher.trigger('primedisplay', 'image_served', {"filePath": filePath ,"url" : req.url, "num_served": num_images_served, "bytes_served" : num_bytes_served});
             }

        }
        else
        {
            //for our own troubleshooting
            console.dir(err);
            res.end("\nError 3\n");
        };
    });
 }
/* ****************************************************************************** */
/* give a full file path, return the folder.  put another way... strip off the filename */
/* ****************************************************************************** */
function getFolderFromFilePath(fullPath)
{
    var folder = "/";

    // todo: strip off trailing slash from fullPath if it exists
    //  in javascript?

    var last_slash_position = fullPath.lastIndexOf("/");
    if (last_slash_position > 0)
    {
        folder = fullPath.substr(0,last_slash_position);
    }
    return folder;
}
// ******************************************************************************
//
//  Given a valid pd image url, return a local path
//
// input: pd.nla.com//PD-5321d4f45b7270742a081895/wid/hi/u/10.10.1.108/images/chart.png
// output: /export/NodePrimeDisplay/imageserver/public/user_images/PD-5321d4f45b7270742a081895/10.10.1.108/images/chart.png
// ******************************************************************************
function buildLocalFilepath(url)
{
    url = url.substr(2);
    var parts = url.split('/');
    var cust_id = parts[0];
    var first_slash_position = url.indexOf("/u/");
    var filePath = url.substr(  first_slash_position + 3 );
    return  __dirname + '/public/user_images/' + cust_id + '/' + filePath;
}
 /* ****************************************************************************** */
 /* ****************************************************************************** */
 /* ****************************************************************************** */
function respondToSaveURL(req,res)
{
    if (req.method == 'POST')
    {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function ()
        {
            //res.end("OK");
            //    user: '5363e1f4b1862412000491e8', //MongoLab User table ID
            //   urlToReplace: 'http://mycoolsite.com/xyz.jpg',
            //   editedUrl: 'http://aviary.com/xxxx.jpg',
            //   sharedSecret: 'abcd'
            var POST = JSON.parse(body);
            if ( POST.editedUrl.substr(0,7) != "http://")
            {
                POST.editedUrl = "http://" + POST.editedUrl;
            }

            if (POST.sharedSecret == secrets.PrimeDisplay.imageSaveSecret)
            {
                // determine where to place the file
                //http://pd.nla.com//PD-5321d4f45b7270742a081895/wid/hi/u/10.10.1.108/images/CS_logo1025.svg

                var urlToReplace = POST.urlToReplace;
                if (urlToReplace.substr(0,7) == "http://") urlToReplace = urlToReplace.substr(7);
                if (urlToReplace.substr(0,7) == "HTTP://") urlToReplace = urlToReplace.substr(7);

                var fake_url =  '//' + POST.user + "/wid/hi/u/" + urlToReplace;

                //PD-5321d4f45b7270742a081895/wid/hi/u/10.10.1.108/images/CS_logo1025.svg             (GOOD)

                //pd.nla.com//5363e1f4b1862412000491e8/wid/hi/u/http://10.10.1.108/images/chart.png   (BAD)

                console.log("\nFAKEURL:" + fake_url);

                var localPath = buildLocalFilepath(fake_url);
                var local_folder = getFolderFromFilePath( localPath );
                mkdirp((local_folder), function(err)
                {
                    //--------------------------------------------------------------------------
                    // grab the file
                    //--------------------------------------------------------------------------
                    request(POST.editedUrl).pipe(fs.createWriteStream(localPath))
                    .on('error', function(e)
                    {
                        console.log("\nGET request error for:" +   POST.editedUrl   );
                        console.log("\nGot error: " + e.message);
                        res.writeHead(500, {'Content-Type': 'text/html'});
                        res.end("{ return_code: error1;}");
                    })
                    .on('end', function(e)
                    {
                        res.status = 200;
                        res.writeHead(200, {'Content-Type': 'text/JSON'});
                        res.end("{ return_code: ok; url: http:" + fake_url + "; }");
                        res.destroy();
                    });
                });
            }
            else
            {
                console.log("\nBad Secret:" +   POST.sharedSecret + "Ours:" +  secrets.PrimeDisplay.imageSaveSecret   );
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.end("{ return_code: security_error; }");
            }
        });
    }
}


