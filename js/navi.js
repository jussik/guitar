var navi = {
    iconSize:28,
    animDur:300,
    visible:false,
    elems:[]
};

$(function() {
    initNavi("account",{title:"Account",icon:"img/home.png"});
    initNavi("options",{title:"Options",icon:"img/settings.png"});
    initNavi("guitar",{title:"Guitar",icon:"img/globe.png"});
    initNavi("admin",{title:"Admin",icon:"img/admin.png"});
});

function initNavi(id,data) {
    for(var i=0;i<navi.elems.length;i++) {
        if(navi.elems[i].id == id)
            return;
    }

    var e = {
        id:id,
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

    $("#"+e.id).wrap('<div/>')
        .removeAttr("id")
        .addClass("navi_content")
        .parent().attr("id",e.id)
                 .addClass("navi_root");

    e.div = $("#"+e.id);

    e.div.prepend(
        '<div class="navi_header">'+
            '<div class="navi_title"/>'+
            '<img class="navi_icon"/>'+
        '</div>');
    $(".navi_title",e.div)
        .text(data.title)
        .css({
            "left":navi.iconSize+"px",
            "height":navi.iconSize+"px",
            "line-height":navi.iconSize+"px",
        });
    $(".navi_icon",e.div)
        .attr("src",data.icon)
        .attr("alt",data.title)
        .css({
            "width":navi.iconSize-4+"px",
            "height":navi.iconSize-4+"px",
        });
    $(".navi_header",e.div)
        .css({
            "height":navi.iconSize+"px",
        });

    $(".navi_header",e.div).click($.proxy(
        function() {
            if(!this.content.visible) {
                this.queueShowContent = true;
                showContent(this);
            } else {
                hideContent(this);
            }
        },e));
    $(".navi_header",e.div).mouseover($.proxy(
        function() {
            this.mouseOverTitle = true;
            if(!this.content.visible) {
                showTitle(this);
            }
        },e));
    $(".navi_header",e.div).mouseleave($.proxy(
        function() {
            this.mouseOverTitle = false;
            if(!this.content.visible) {
                hideTitle(this);
            }
        },e));
   
    e.content.width = $(".navi_content",e.div).width()+10;
    e.content.height = $(".navi_content",e.div).height()+10;
    $(".navi_content",e.div).hide();

    e.title.width = $(".navi_title",e.div).width()+10;

    e.div.width(navi.iconSize+e.title.width);
    e.div.height(navi.iconSize);

    navi.elems.push(e);
    
    hideTitle(e);
}

function showContent(e) {
    if(e.animating || e.content.visible) return;
    if(navi.visible != false) {
        hideContent(navi.visible, e);
    }
    navi.visible = e;
    e.animating = true;
    e.div.animate(
        {height:e.content.height+navi.iconSize,width:e.content.width},
        navi.animDur,
        $.proxy(function() {
            this.queueShowContent = false;
            this.content.visible = true;
            this.animating = false;
        },e)
    );
    $(".navi_content",e.div).show();
}

function hideContent(e) {
    if(e.animating || !e.content.visible) return;
    e.animating = true;
    e.div.animate(
        {height:navi.iconSize,width:navi.iconSize+e.title.width},
        navi.animDur,
        $.proxy(function() {
            $(".navi_content",this.div).hide();
            this.content.visible = false;
            this.animating = false;
            if(navi.visible == e)
                navi.visible = false;
            if(this.mouseOverTitle)
                showTitle(this);
            else
                hideTitle(this);
        },e)
    );
}

function hideTitle(e) {
    if(e.animating || !e.title.visible || e.content.visible) return;
    e.animating = true;
    e.div.animate(
        {height:navi.iconSize,width:navi.iconSize},
        navi.animDur,
        $.proxy(function() {
            $(".navi_title",this.div).hide();
            this.title.visible = false;
            this.animating = false;
            if(this.mouseOverTitle || this.queueShowContent)
                showTitle(this);
        },e)
    );
}

function showTitle(e) {
    if(e.animating || e.title.visible || e.content.visible) return;
    animating = true;
    e.div.animate(
        {height:navi.iconSize,width:navi.iconSize+e.title.width},
        navi.animDur,
        $.proxy(function() {
            this.title.visible = true;
            this.animating = false;
            if(this.queueShowContent) {
                showContent(this);
            } else if(!this.mouseOverTitle) {
                hideTitle(this);
            }
        },e)
    );
    $(".navi_title",e.div).show();
}
