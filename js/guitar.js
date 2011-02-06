var Guitar = Class.extend({
init: function() {
    this.title = '';
    this.data = {
        strings:6, // slider
        handedness:'R', // Left/Right buttons
        scale:25.5, // slider
        heel:"B", // Bolt-on/Set/Neck-through buttons
        neck:[{ // Neck material dialogue
                type:"M", // Wood selector
                offset:45 // slider
            },{
                type:"R",
                offset:50
            }],
        fretboard:{ // Fretboard dialogue
            material:"M", // Wood selector
            binding:"w", // Material selector
            frets:24, // slider
            inlays:{ // Inlay tab of dialogue
                shape:"D", // Inlay selector
                config:1, // Inlay positions config
                color:"w" // Material selector
            }
        },
        body:{ // Shape dialogue
            shape:"RG", // Model selector
            wood:"AL", // Wood selector
            veneer:"MFL", // Wood selector
            opacity:0.4, // slider
            finish:'g', // finish selector
            color:"k", // Color selector
            burst_opacity:0.4, // slider
            burst_color:"r" // Color selector
        },
        head:{ // Shape dialogue
            shape:"IBZ",
            opacity:0,
            finish:'g',
            wood:"M",
            color:"k"
        },
        bridge_pickup:{ // Pickup dialogue
            type:"E", // Model selector
            angle:1 // slider
        },
        //middle_pickup:{}, // Pickup dialogue
        neck_pickup:{ // Pickup dialogue
            type:"E",
            angle:1
        },
        bridge:{ // Bridge dialogue
            bridgemat:"ch", // Metal material selector
            type:"OFR", // Model selector
            nutmat:"ch" // Material selector (if bridge is not FR or kahler)
        }
    };
    var p = {};
},

loadFromURL: function() {
    var map = {};
    $(window.location.hash.substr(1).split('&')).each(function() {
        var o = this.split("=");
        map[o[0]] = o[1];
    });
},

error: function(err) {
    alert(err);
},

updateURL: function() {
    var list = [];
    if(this.title.length > 0) {
        list.push('title='+escape(this.title));
    }
    list.push('guitar='+this._getGuitarDef());

    window.location = "#"+list.join('&');
},

get: function(arg) {
    switch(arg) {
        case "strings": case "handedness":
        case "scale": case "heel":
            return this.data[arg];
    }
},

set: function(arg, val) {
    switch(arg) {
        case "strings": case "handedness":
        case "scale": case "heel":
            this.data[arg] = val; break;
    }
},

_getGuitarDef: function() {
    var guitar = this.data;

    var str = guitar.strings;
    str += guitar.handedness;
    str += guitar.scale;
    str += guitar.heel;
    for(m in guitar.neck) {
        var mat = guitar.neck[m];
        str += mat.type;
        if(mat.offset && mat.offset < 50) str += mat.offset;
    }
    str += ";"+guitar.fretboard.material;
    str += guitar.fretboard.binding;
    str += guitar.fretboard.frets;
    if(guitar.fretboard.inlays != undefined) {
        str += guitar.fretboard.inlays.shape;
        str += guitar.fretboard.inlays.config;
        str += guitar.fretboard.inlays.color;
    } else {
        str += "_";
    }
    str += guitar.body.shape;
    str += guitar.body.opacity;
    str += guitar.body.finish;
    str += guitar.body.wood;
    if(guitar.body.veneer)
        str += "."+guitar.body.veneer;
    str += guitar.body.color;
    str += guitar.head.shape;
    str += guitar.head.opacity;
    str += guitar.head.finish;
    str += guitar.head.wood;
    if(guitar.head.veneer)
        str += "."+guitar.head.veneer;
    str += guitar.head.color;
    if(guitar.bridge_pickup != undefined) {
        str += guitar.bridge_pickup.type;
        str += guitar.bridge_pickup.angle;
    } else {
        str += "_";
    }
    if(guitar.middle_pickup != undefined) {
        str += guitar.middle_pickup.type;
        str += guitar.middle_pickup.angle;
    } else {
        str += "_";
    }
    if(guitar.neck_pickup != undefined) {
        str += guitar.neck_pickup.type;
        str += guitar.neck_pickup.angle;
    } else {
        str += "_";
    }
    str += guitar.bridge.bridgemat;
    str += guitar.bridge.type;
    str += guitar.bridge.nutmat;

    return str;
},

_loadGuitar: function(str) {
    var p = {};
    p.str = str;
    p.orig = p.str;
    if(!p.str || p.str.length == 0) return;
    
    try {
	var guitar = {};
        guitar.strings = this._tokInt(p,5,9);
	guitar.handedness = this._tokSet(p,['L','R']);
	guitar.scale = this._tokReal(p,20.0,35.0);
	guitar.heel = this._tokSet(p,['B','S','N']);

	guitar.neck = [];
	this._parseNeck(p);

	guitar.fretboard = {};
	guitar.fretboard.material = this._tokUpperID(p);
	guitar.fretboard.binding = this._tokLowerID(p);
	guitar.fretboard.frets = this._tokInt(p,21,27);

	if(this._tokSet(p,'_',true) == null) {
	    guitar.fretboard.inlays = {};
	    guitar.fretboard.inlays.shape = this._tokUpperID(p);
	    guitar.fretboard.inlays.config = this._tokInt(p,1,3);
	    guitar.fretboard.inlays.color = this._tokLowerID(p);
	}
	
	guitar.body = {};
	guitar.body.shape = this._tokUpperID(p);
	guitar.body.opacity =  this._tokReal(p,0.0,1.0);
	guitar.body.finish = this._tokLowerID(p);
	guitar.body.wood = this._tokUpperID(p);
	if(this._tokSet(p,'.',true) != null) {
	    guitar.body.veneer = this._tokUpperID(p);
	}
	guitar.body.color = this._tokLowerID(p);

	guitar.head = {};
	guitar.head.shape = this._tokUpperID(p);
	guitar.head.opacity =  this._tokReal(p,0.0,1.0);
	guitar.head.finish = this._tokLowerID(p);
	guitar.head.wood = this._tokUpperID(p);
	if(this._tokSet(p,'.',true) != null) {
	    guitar.head.veneer = this._tokUpperID(p);
	}
	guitar.head.color = this._tokLowerID(p);

	if(this._tokSet(p,'_',true) == null) {
	    guitar.bridge_pickup = {};
	    guitar.bridge_pickup.type = this._tokUpperID(p);
	    guitar.bridge_pickup.angle = this._tokInt(p,1,2);
	}

	if(this._tokSet(p,'_',true) == null) {
	    guitar.middle_pickup = {};
	    guitar.middle_pickup.type = this._tokUpperID(p);
	    guitar.middle_pickup.angle = this._tokInt(p,1,2);
	}

	if(this._tokSet(p,'_',true) == null) {
	    guitar.neck_pickup = {};
	    guitar.neck_pickup.type = this._tokUpperID(p);
	    guitar.neck_pickup.angle = this._tokInt(p,1,2);
	}
	
	guitar.bridge = {};
	guitar.bridge.bridgemat = this._tokLowerID(p);
	guitar.bridge.type = this._tokUpperID(p);
	var nutmat = this._tokLowerID(p,true);
	if(nutmat != null)
	    guitar.bridge.nutmat = nutmat;

        this.data = guitar;
    } catch(e) {
        this.error(e);
    }
},

_parseNeck: function(p) {
    var slice = {}
    slice.type = this._tokUpperID(p);
    var end = tokSet([';'],true);
    if(end != null) {
	slice.offset = 50;
    } else {
	slice.offset = this._tokInt(p,0,50);
    }
    guitar.neck.push(slice);
    if(end == null) {
	this._parseNeck(p);
    }
},

_parseErrorPos: function(p) {
    var pad = "";
    var plen = p.orig.length - p.str.length;
    for(var i=0;i<plen;i++) {
        pad += "&nbsp;";
    }
    return "<br/>"+p.orig+"<br/>"+pad+"^";
},

_parseFmtError: function(p,type) {
    throw "Parser Error: Expected "+type+this._parseErrorPos(p);
},
_parseRangeError: function(p,min,max,val) {
    throw "Parser Error: Value "+val+" not between "+min+" and "+
        max+this._parseErrorPos(p);
},

_tokInt: function(min,max,optional) {
    if(min === undefined) min = 0;
    if(max === undefined) max = Number.MAX_VALUE;
    if(!p.str.length)
        this._parseFmtError(p,"integer");
    var match = /^(\d+)(.*)$/.exec(p.str);
    if(match) {
        var val = this._parseInt(p,match[1]);
        p.str = match[2];
        if(val >= min && val <= max) {
            return val;
        } else {
            this._parseRangeError(p,min,max,val);
        }
    } else if(optional) {
        return null;
    } else {
        this._parseFmtError(p,"integer");
    }
},

_tokReal: function(p,min,max,optional) {
    if(min === undefined) min = 0.0;
    if(max === undefined) max = Number.MAX_VALUE;
    if(!p.str.length)
        this._parseFmtError(p,"real");
    var match = /^(\d+(\.\d+)?)(.*)$/.exec(p.str);
    if(match) {
        var val = this._parseFloat(p,match[1]);
        p.str = match[3];
        if(val >= min && val <= max) {
            return val;
        } else {
            this._parseRangeError(p,min,max,val);
        }
    } else if(optional) {
        return null;
    } else {
        this._parseFmtError(p,"real");
    }
},

_tokSet: function(p,set,optional) {
    if(!p.str.length)
        this._parseFmtError(p,"one of ("+set+")");
    var found = false;
    var val;
    for(s in set) {
	if(p.str.indexOf(set[s]) == 0) {
	    found = true;
	    val = set[s];
	    p.str = p.str.substr(val.length);
	    break;
	}
    }
    if(found)
	return val;
    else if(optional)
	return null;
    else
	this._parseFmtError(p,"one of ("+set+")");
},

_tokUpperID: function(p,optional) {
    if(!p.str.length)
        this._parseFmtError(p,"uppercase ID");
    var match = /^([A-Z]+)(.*)$/.exec(p.str);
    if(match) {
        var val = match[1];
        p.str = match[2];
        return val;
    } else if(optional) {
        return null;
    } else {
        this._parseFmtError(p,"uppercase ID");
    }
},

_tokLowerID: function(p,optional) {
    if(!p.str.length)
        parseFmtError(p,"lowercase ID");
    var match = /^([a-z]+)(.*)$/.exec(p.str);
    if(match) {
        var val = match[1];
        p.str = match[2];
        return val;
    } else if(optional) {
        return null;
    } else {
        this._parseFmtError(p,"lowercase ID");
    }
}
});
