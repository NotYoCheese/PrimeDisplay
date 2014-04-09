var Scraper = require('./scraper')

var scraper = Scraper.create();
scraper.scrapeSite('http://direct.coinsociety.com', 10, function(err, imgList) {
    var index;
    console.log("Done!");
    for (index = 0; index < imgList.length; index++) {
        console.dir(imgList[index]);
    }
});
