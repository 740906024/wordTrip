cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
    },

    // use this for initialization
    onLoad: function () {
        this.node.active = false;
    },

    // called every frame
    show: function (str) {
    	this.label.string = str;
    	this.node.active = true;
    	var self = this;
    	setTimeout(function(){
    		self.node.active = false;
    	},500)
    }
});