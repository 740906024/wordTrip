cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.node.touchState = true
    },

    init:function(word,game){
        this.node.getChildByName("lab").getComponent(cc.Label).string = word
        this.node.word = word
        this.game = game;
    },

    // called every frame
    setTouchState: function (bool) {
        this.node.getComponent(cc.Button).interactable = bool
        this.node.touchState = bool
    },

    setLabWord:function(word){
        this.node.getChildByName("lab").getComponent(cc.Label).string = word
        this.node.word = word
    },

    onBottomBtnTouch:function(){
        this.game.onBottomBtnTouch(this.node)
    }

});
