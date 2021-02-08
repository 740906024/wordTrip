cc.Class({
    extends: cc.Component,

    properties: {
        wordItem: {
            default: null,
            type: cc.Node
        },
        // defaults, set visually when attaching this script to the Canvas
        wordList : []
    },

    // use this for initialization
    onLoad: function () {
        this.layout = this.node.getChildByName("layout");
        this.cleanLayout()
    },

    // called every frame
    update: function (dt) {

    },

    cleanLayout : function(){
        this.layout.removeAllChildren();
        this.wordList = []
        this.node.getChildByName("btnSure").getComponent(cc.Button).interactable = false
        this.node.getChildByName("btnClean").getComponent(cc.Button).interactable = false
    },

    pushWord : function(wordNode){
        if(this.isFitWords()){
            return
        }
        let item = cc.instantiate(this.wordItem)
        item.getChildByName("lab").getComponent(cc.Label).string = wordNode.word
        item.word = wordNode.word
        item.wordNode = wordNode
        this.layout.addChild(item)
        this.wordList.push(item)
        this.node.getChildByName("btnClean").getComponent(cc.Button).interactable = true
        if(this.wordList.length>=4){
            this.node.getChildByName("btnSure").getComponent(cc.Button).interactable = true
        }
    },

    isFitWords:function(){
        return this.wordList.length>=4
    },

    onClean:function(){
        for (var i = 0; i < this.wordList.length; i++) {
            // this.wordList[i].wordNode.active = true
            this.wordList[i].wordNode.getComponent("WordItem").setTouchState(true)
        };
        this.cleanLayout()
    },


    removeWordItem : function(event){
         var target = event.target
         // target.wordNode.active = true
         target.wordNode.getComponent("WordItem").setTouchState(true)
         this.wordList.remove(target)
         target.removeFromParent()
         this.node.getChildByName("btnSure").getComponent(cc.Button).interactable = false
    },

    getEndWords:function(event){
        var endWords = ""
        if(this.wordList.length<4){
            return endWords
        }else{
            for (var i = 0; i < this.wordList.length; i++) {
                endWords = endWords + this.wordList[i].word
            };
            return endWords
        }
    }
});
