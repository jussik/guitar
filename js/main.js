$(window).load(function() {
    $("#error").Error();
    $("#editor").Editor({
        loadingLabel:$("#overlay_text"),
        onReady:editorLoaded,
        onNoSupport:editorNoSupport,
        onError:editorError
    });
});

function editorLoaded() {
    $("#navi").Navi();
    $("#overlay").delay(500).fadeOut(500);
}
function editorNoSupport() {
    $("#overlay_img")
        .delay(500)
        .animate({opacity:0},500);
    $("#overlay_text")
        .delay(500)
        .addClass('nosupport')
        .html(
        'Unfortunately, your browser does not support '+
        '<a href="http://www.khronos.org/webgl">WebGL.</a><br/>'+
        'Try the latest version of one of the following browsers:<br/>'+
        '<a href="http://www.mozilla.com/firefox">Mozilla Firefox</a>'+
        ' | <a href="http://www.google.com/chrome">Google Chrome</a>')
        .show()
        .animate(
            {"margin-top":
                -$("#overlay_img").height()/2
                -$("#overlay_text").height()/2,
             "opacity":1
            },500);
}
function editorError(err) {
    $("#error").Error("error",err);
}
