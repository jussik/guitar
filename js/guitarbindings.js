function createGuitarBindings(g) {
    new SliderBinding(g,"strings",'{"strings":%}');
    new HandednessBinding(g,"handedness",'{"handedness":%}');
}

var Binding = Class.extend({
    init:function(guitar, id, map) {
        this.guitar = guitar;
        this.elem = $("#guitar_"+id);
        this.map = map;
    }
});

var SliderBinding = Binding.extend({
    init:function(guitar, id, map) {
        this._super(guitar, id, map);

        this.elem
            .append('<div class="gb_label">6</div>')
            .append('<div class="gb_slider"></div>');

        $(".gb_slider",this.elem).slider({
            value:6,
            min:6,
            max:8,
            step:1,
            slide:$.proxy(function(e,ui) {
                $(".gb_label",this.elem).text(ui.value);
                var data = this.map.replace("%",ui.value);
                $.extend(this.guitar.data,$.parseJSON(data));
                this.guitar.updateURL();
            },this)
        });
    }
});

var HandednessBinding = Binding.extend({
    init:function(guitar, id, map) {
        this._super(guitar, id, map);

        this.elem.change($.proxy(this.onChange,this));
    }
});
