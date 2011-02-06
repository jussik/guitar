$.widget("ui.Navi",{
options: {
    iconSize:28,
    animDur:300,
    visible:false,
    elems:[]
},

_init: function() {
    if(!$('head link[href="css/jquery-ui-navi.css"]').length) {
        $('head').append('<link rel="stylesheet" type="text/css" '+
                'href="css/jquery-ui-navi.css"/>');
    }

    $(this.element).children().each(
        $.proxy(function(idx, elem) {
            this._initNavi(elem)
        },this)
    );
},

_initNavi: function(elem) {
    var e = {
        widget:this,
        animating:false,
        mouseOverTitle:false,
        queueShowContent:false,
        title: {
            visible:true,
        },
        content: {
            visible:false,
        }
    }

    var title = $(elem).attr("data-title");
    var icon = $(elem).attr("data-image");

    $(elem).addClass("navi_content").wrap('<div/>');

    e.div = $(elem).parent().addClass("navi_root");

    e.div.prepend(
        '<div class="navi_header">'+
            '<div class="navi_title"/>'+
            '<img class="navi_icon"/>'+
        '</div>');
    $(".navi_title",e.div)
        .text(title)
        .css({
            "left":this.options.iconSize+"px",
            "height":this.options.iconSize+"px",
            "line-height":this.options.iconSize+"px",
        });
    $(".navi_icon",e.div)
        .attr("src",icon)
        .attr("alt",title)
        .css({
            "width":this.options.iconSize-4+"px",
            "height":this.options.iconSize-4+"px",
        });
    $(".navi_header",e.div)
        .css({
            "height":this.options.iconSize+"px",
        });

    $(".navi_header",e.div).click($.proxy(
        function() {
            if(!this.content.visible) {
                this.queueShowContent = true;
                this.widget._showContent(this);
            } else {
                this.widget._hideContent(this);
            }
        },e));
    $(".navi_header",e.div).mouseover($.proxy(
        function() {
            this.mouseOverTitle = true;
            if(!this.content.visible) {
                this.widget._showTitle(this);
            }
        },e));
    $(".navi_header",e.div).mouseleave($.proxy(
        function() {
            this.mouseOverTitle = false;
            if(!this.content.visible) {
                this.widget._hideTitle(this);
            }
        },e));
   
    e.content.width = $(".navi_content",e.div).width()+10;
    e.content.height = $(".navi_content",e.div).height()+10;
    $(".navi_content",e.div).hide();

    e.title.width = $(".navi_title",e.div).width()+10;

    e.div.width(this.options.iconSize+e.title.width);
    e.div.height(this.options.iconSize);

    this.options.elems.push(e);
    
    this._hideTitle(e);
},

_showContent: function(e) {
    if(e.animating || e.content.visible) return false;
    if(this.options.visible != false) {
        if(!this._hideContent(this.options.visible)) return false;
    }
    this.options.visible = e;
    e.animating = true;
    e.div.animate(
        {height:e.content.height+this.options.iconSize,
            width:e.content.width},
        this.options.animDur,
        $.proxy(function() {
            this.queueShowContent = false;
            this.content.visible = true;
            this.animating = false;
        },e)
    );
    $(".navi_content",e.div).show();
    return true;
},

_hideContent: function(e) {
    if(e.animating || !e.content.visible) return false;
    e.animating = true;
    e.div.animate(
        {height:this.options.iconSize,
            width:this.options.iconSize+e.title.width},
        this.options.animDur,
        $.proxy(function() {
            $(".navi_content",this.div).hide();
            this.content.visible = false;
            this.animating = false;
            if(this.widget.options.visible == e)
                this.widget.options.visible = false;
            if(this.mouseOverTitle)
                this.widget._showTitle(this);
            else
                this.widget._hideTitle(this);
        },e)
    );
    return true;
},

_hideTitle: function(e) {
    if(e.animating || !e.title.visible || e.content.visible) return false;
    e.animating = true;
    e.div.animate(
        {height:this.options.iconSize,
            width:this.options.iconSize},
        this.options.animDur,
        $.proxy(function() {
            $(".navi_title",this.div).hide();
            this.title.visible = false;
            this.animating = false;
            if(this.mouseOverTitle || this.queueShowContent)
                this.widget._showTitle(this);
        },e)
    );
    return true;
},

_showTitle: function(e) {
    if(e.animating || e.title.visible || e.content.visible) return false;
    e.animating = true;
    e.div.animate(
        {height:this.options.iconSize,
            width:this.options.iconSize+e.title.width},
        this.options.animDur,
        $.proxy(function() {
            this.title.visible = true;
            this.animating = false;
            if(this.queueShowContent) {
                this.widget._showContent(this);
            } else if(!this.mouseOverTitle) {
                this.widget._hideTitle(this);
            }
        },e)
    );
    $(".navi_title",e.div).show();
    return true;
}

});
