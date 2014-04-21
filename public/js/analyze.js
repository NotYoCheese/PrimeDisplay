// var myApp = angular.module('myApp', []);

// myApp.controller('MyController', ['$scope', '$http', function ($scope, $http) {
//     console.log(document.forms['AnalyzeForm']);
//     $http.post('/analyze', document.forms['AnalyzeForm']).success(function(data) {
//         $scope.scrapedPages = data;
//     });
// }]);

// $(document).ready(function() {
//     $("#btns > a.btn").click(handleImageDemoClick);
// });

var handleAnalyzeClick = function() {
    var urlToScrape = $('#site').attr('value');
    console.log('handle click');
    var url = '/analyze';
    $.ajax({
        url: url,
        cache: false,
        timeout: 60000,
        type: 'post',
        data: {site: urlToScrape, _csrf:$('#_csrf').attr('value')},
        success: function(data) {
            console.log('got data');
            //console.dir($('#imgList'));
            var googleData = JSON.parse(data);
            console.dir(data);
            html = 'Page Speed: ' + googleData.score;
            $('#imgList').html(html);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error: " + textStatus);
        }
    });
};

$(document).ready(function() {
    $("#analyzeBtn").click(handleAnalyzeClick);
});
