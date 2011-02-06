$.widget("ui.Error",{
options:{visible:false},
_init:function() {
    this.options.div = $(this.element[0])
        .addClass("error_outer")
        .append('<div class="error_inner" />');
    $('.error_inner',this.options.div)
        .append('<div class="error_close">x</div>')
        .append('<div class="error_content"></div>');
    $('.error_close').click($.proxy(this._hide,this));
    this.options.div.hide();
},
error:function(err) {
    if(!this.options.visible) {
        this.options.div.show('slide',{direction:'up'});
        this.options.visible = true;
    }
    console.error(err);
    $('.error_content',this.options.div).html(err);
},
_hide:function() {
    this.options.div.hide('slide',{direction:'up'});
    this.options.visible = false;
}
});
