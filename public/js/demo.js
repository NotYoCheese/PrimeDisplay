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

$(document).ready(function() {
    $('#imgToReplace').hide(0);
    $("#btns > a.btn").click(handleImageDemoClick);
});