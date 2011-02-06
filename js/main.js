var guitar;

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
    initNavi();
    initAccount();
    initGuitar();

    $("#overlay").delay(500).fadeOut(500);
}

function initNavi() {
    $("#navi").Navi();
    $("#editor").click(function() {
        $("#navi").Navi("collapse");
    });
}

function initAccount() {}
function initGuitar() {
    Guitar.prototype.error = editorError;

    guitar = new Guitar();
    guitar.loadFromURL();
    guitar.updateURL();

    createGuitarBindings(guitar);

    $("#guitar_title").change(function() {
        val = $(this).val();
        guitar.title = val;
        guitar.updateURL();
        if(val.length > 0)
            $("head title").text("Guitar Builder - "+val);
        else
            $("head title").text("Guitar Builder");
    });
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
        ' | <a href="http://www.google.com/chrome">Google Chrome</a><br/>'+
        '<button>Ignore</button>')
        .show()
        .animate(
            {"margin-top":
                -$("#overlay_img").height()/2
                -$("#overlay_text").height()/2,
             "opacity":1
            },500);
    $("#overlay_text button").button().click(function() {
        editorError("<strong>No WebGL support</strong>: Editor is disabled.");
        editorLoaded();
    });
}
function editorError(err) {
    $("#error").Error("error",err);
}
