$.widget('ui.Editor',{
options:{},
// MAIN BITS
_init:function(data) {
    $.extend(this.options,data);
    this.canvas = this.element[0];

    this.canvas.width = $(this.canvas).width();
    this.canvas.height = $(this.canvas).height();

    this.options.loadingLabel.html("Loading <strong>Guitar Builder</strong>");

    if(!$W.initialize(this.canvas)) {
        this.options.onNoSupport();
        return;
    }
    $W.GL.clearColor(0.8,0.8,0.8,1.0);
    $W.camera.setPosition(0,3,-4);
    
    var squareData = [
        ["vertex",[
            -1,0,-1,
             1,0, 1,
             1,0,-1,
            -1,0, 1
            ]
        ],["color",[
            1,0,1,
            1,1,0,
            0,1,1,
            1,0,0
            ]
        ],["wglu_elements",[
            0,3,2,
            1,2,3
            ]
        ]
    ];

    var square = $W.createObject({type:$W.GL.TRIANGLES, data:squareData});
    square.animation._update = function() {
        this.setRotation(this.age/40,0,0);
    };

    $W.update = $.proxy(this._onUpdate,this);
    //$W.start(20);

    this.options.onReady();
},
_error:function(err) {
    this.options.onError(err);
},
_onUpdate:function() {
    this.canvas.width = $(this.canvas).width();
    this.canvas.height = $(this.canvas).height();
}
});
