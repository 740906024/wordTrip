cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        lab_redpack: {
            default: null,
            type: cc.Label
        },

        lab_gold:{
            default:null,
            type:cc.Label
        },

        hongbaoNode:{
            default:null,
            type:cc.Node
        },

        redpack_progress:{
            default:null,
            type:cc.ProgressBar
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    init : function(c){
        this.node.active = true
        this._controller = c
        this._playerData = c.gameDataMgr.playerData
        this._initView()
        this._controller.AdsMgr.showBannerAd()
        if(c.gameDataMgr.newPlayer){
            c.onModelRedPack()
        }
        if(this._controller.gameDataMgr.red_pack){
            this.hongbaoNode.active = false;
        }
    },

    _initView:function(){
        this.lab_redpack.string = this._playerData.redPack.toFixed(2)
        this.lab_gold.string = this._playerData.gold
        this.redpack_progress.progress = this._playerData.redPack/100;
    },

    refreshView:function(){
        var self = this
        this.lab_redpack.string = this._playerData.redPack.toFixed(2)
        var gold = this.lab_gold.string;
        if(this._playerData.gold>parseInt(gold)){
            var dunm = parseInt((this._playerData.gold-parseInt(gold))/5)
            var act = cc.sequence(cc.delayTime(0.1),cc.callFunc(function(){
                gold = parseInt(gold)+dunm
                self.lab_gold.string = gold
            }))
            this.lab_gold.node.runAction(cc.sequence(
                cc.callFunc(function(){
                    self.lab_gold.node.color = cc.Color.GREEN;
                }),
                cc.repeat(act,5),
                cc.callFunc(function(){
                    self.lab_gold.node.color = cc.Color.WHITE;
                    self.lab_gold.string = self._playerData.gold;
                })
            ))
        }else{
            this.lab_gold.string = this._playerData.gold
        }
        this.redpack_progress.progress = this._playerData.redPack/100;
    },

    onGameStart:function(enevt,type){
        type = parseInt(type)
        setTimeout(function(){
            this._controller.startGame(type)
        }.bind(this),0)
    },

    onGameTest : function(){
        // this._controller.gameDataMgr.playerData.level = 11
        cc.log(this._controller.gameDataMgr.playerData.level)
    },

    addGoldWithAd:function(){
        var self = this;
        this._controller.AdsMgr.showRewardedVideoAd(function(){
            self._controller.gameDataMgr.updateGold(parseInt(40));
        })
    }
});
