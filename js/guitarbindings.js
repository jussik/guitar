function createGuitarBindings(g) {
    new SliderBinding(g,"strings",6,8,1);
    new HandednessBinding(g,"handedness",
        {"L":"Left","R":"Right"});
    new SliderBinding(g,"scale",23,30,0.25);
    new HandednessBinding(g,"heel",
        {"N":"NT","S":"Set","B":"Bolt-on"});
}

var Binding = Class.extend({
    init:function(guitar, id) {
        this.guitar = guitar;
        this.elem = $("#guitar_"+id);
        this.id = id;
    }
});

var SliderBinding = Binding.extend({
    init:function(guitar, id, min, max, step) {
        this._super(guitar, id);

        var value = this.guitar.get(this.id);

        this.elem
            .append('<div class="gb_label">'+this._label(value)+'</div>')
            .append('<div class="gb_slider"></div>');

        $(".gb_slider",this.elem).slider({
            value:value,
            min:min,
            max:max,
            step:step,
            slide:$.proxy(function(e,ui) {
                $(".gb_label",this.elem).html(this._label(ui.value));
                this.guitar.set(this.id,ui.value)
                this.guitar.updateURL();
            },this)
        });
    },
    _label:function (val) {
        var msg = val.toString().replace(".5","&frac12;");
        msg = msg.replace(".25","&frac14;");
        msg = msg.replace(".75","&frac34;");
        return msg;
    }
});

var HandednessBinding = Binding.extend({
    init:function(guitar, id, options) {
        this._super(guitar, id);

        var value = this.guitar.get(this.id);

        for(var o in options) {
            this.elem.append('<input type="radio" value="'+o+'" '+
                    'id="guitar_'+id+'_'+o+'"'+
                    'name="guitar_'+id+'_radio"'+
                    (value==o?'checked="checked"':'')+'/>')
                .append('<label for="guitar_'+id+'_'+o+'">'+
                    options[o]+'</label>');
        }

        this.elem.buttonset()
            .change($.proxy(function(e) {
                this.guitar.set(this.id,e.target.value);
                this.guitar.updateURL();
            },this));
    }
});
