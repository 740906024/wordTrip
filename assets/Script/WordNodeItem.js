var AC = require('actions')
cc.Class({
    extends: cc.Component,

    properties: {
        stateFinish:1,
        stateUnFinish:0
    },
    //state 0:未完成 1：完成
    // use this for initialization
    init: function (words,game) {
        this.game = game
        this.node.words = words
        this.node.state = this.stateUnFinish
        for (let i = 0; i < words.length; i++) {
            this.setLabWord(i,words[i])
        };
        cc.log("words = ",words)
    },

    setLabWord:function(index,word){
        this.node.getChildByName("words").getChildByName("word"+index).getChildByName("lab").getComponent(cc.Label).string = word
    },

    setFinished:function(){
        this.node.getChildByName("hongbao").active = false;
        this.node.state = this.stateFinish
        this.node.getChildByName("words").active = true
        for (let i = 0; i < 4; i++) {
            this.node.getChildByName("words").getChildByName("word"+i).active = true
        };
        this.node.runAction(AC.blinkAction(0.1,2))
        // if(this.isResPack){
        //     this.game._controller.onModelRedPack()
        // }
    },

    onTips:function(){
        this.node.getChildByName("words").active = true
        for (let i = 0; i < 4; i++) {
            let active = this.node.getChildByName("words").getChildByName("word"+i).active
            if(!active){
                this.node.getChildByName("words").getChildByName("word"+i).active = true
                if(i === 3) this.setFinished()
                break
            }
        };
    },

    showRedPack:function(){
        if(this.game._controller.gameDataMgr.red_pack){
            return
        }
        this.isResPack = true;
        this.node.getChildByName("hongbao").active = true;
    }
});
