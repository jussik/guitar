$.widget('ui.Editor',{
options:{},
// MAIN BITS
_init:function(data) {
    $.extend(this.options,data);

    this.canvas = this.element[0];
    if(!this.canvas.getContext) {
        this.options.onNoSupport();
        return;
    }
    this.gl = this.canvas.getContext("experimental-webgl");
    var gl = this.gl;
    if(!gl) {
        this.options.onNoSupport();
        return;
    }
    
    gl.clearColor(0.8,0.8,0.8,1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    this.modelview = this._addStack(new Matrix4x4());
    this.perspective = this._addStack(new Matrix4x4());

    this._onResize();

    this.options.loadingLabel.html("Loading <strong>Guitar Builder</strong>");
    this.options.onReady();

    //this.loopInterval = setInterval($.proxy(this._drawLoop,this), 20);
    this._drawLoop();
},
_error:function(err) {
    this.options.onError(err);
},
_onResize:function() {
    this.width = $(this.canvas).width();
    this.height = $(this.canvas).height();

    this.perspective.loadIdentity();
    this.perspective.perspective(45, this.width/this.height,
        0.1, 100.0);

    this.modelview.loadIdentity();
    this.modelview.translate(0,0,-4);
},

// MAIN LOOP
_drawLoop:function() {
    var gl = this.gl;
    gl.viewport(0,0,this.width,this.height);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    this.perspective.push();
    this.modelview.push();

    this.perspective.pop();
    this.modelview.pop();
},

// UTILITIES
_addStack:function(matrix) {
    matrix.stack = new Array();
    matrix.push = function() {
        if(matrix.stack.length > 100) {
            this._error("Error: Matrix stack overflow");
        } else {
            matrix.stack.push(matrix.elements);
        }
    }
    matrix.pop = function() {
        if(matrix.stack.length < 1) {
            this._error("Error: Matrix stack underflow");
        } else {
            matrix.elements = matrix.stack.pop();
        }
    }
    return matrix;
}
});
