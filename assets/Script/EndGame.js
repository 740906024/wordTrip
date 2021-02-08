cc.Class({
    extends: cc.Component,

    properties: {
        lab_level: {
            default: null,
            type: cc.Label
        },

        lab_redpack: {
            default: null,
            type: cc.Label
        },

        lab_redpack1: {
            default: null,
            type: cc.Label
        },

        redpack_progress:{
            default:null,
            type:cc.ProgressBar
        },

        wordParent:{
            default:null,
            type:cc.Node
        },

        wordItem:{
            default:null,
            type:cc.Node
        },

        hongbaoNode1:{
            default:null,
            type:cc.Node
        },
        hongbaoNode2:{
            default:null,
            type:cc.Node
        },
        goldNode:{
            default:null,
            type:cc.Node
        },
        btnAd:cc.Node,
        labGold:cc.Label,
    },

    onLoad:function(){

    },

    init:function(c){
        this._controller = c
        this.gameConfig = c.gameConfig.json
        this.playerData = c.gameDataMgr.playerData
        if(this._controller.gameDataMgr.red_pack){
            this.hongbaoNode1.active = false
            this.hongbaoNode2.active = false
            this.goldNode.y = -100;
        }
    },

    show : function(){
        this.wordParent.removeAllChildren();
        var gamelv = parseInt(this.playerData.level)
        this.lab_level.string = "第"+(gamelv+1)+"关";
        this.lab_redpack.string = this.playerData.redPack.toFixed(2);
        this.lab_redpack1.string = (100-this.playerData.redPack).toFixed(2);
        this.redpack_progress.progress = this.playerData.redPack/100;
        var data = this.gameConfig[gamelv]
        for (var i = 0; i < data.words.length; i++) {
            let item = cc.instantiate(this.wordItem)
            item.getChildByName("lab").getComponent(cc.Label).string = data.words[i];
            item.parent = this.wordParent;
        };
        this.node.active = true;
    },

    showRewardAd:function(){
        var self = this;
        this._controller.AdsMgr.showRewardedVideoAd(function(){
             self._controller.gameDataMgr.updateGold(20);
             self.btnAd.active = false;
             self.labGold.string = "+25";
        })
    }
});
