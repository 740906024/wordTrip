var AC = require('actions')
cc.Class({
    extends: cc.Component,

    properties: {
        // defaults, set visually when attaching this script to the Canvas
        bottomItem: {
            default: null,
            type: cc.Prefab
        },
        bottomNode: {
            default: null,
            type: cc.Node
        },

        wordItem: {
            default: null,
            type: cc.Node
        },
        wordNode: {
            default: null,
            type: cc.Node
        },
        tempWordNode: {
            default: null,
            type: cc.Node
        },
        //view
        lab_level: {
            default: null,
            type: cc.Label
        },

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
        musicMgr:require("MusicMgr"),
        tips : require("Tips"),
        wordslist : [],
        bottomItemsList : []
    },

    onLoad : function(){
        this.bottomNode.removeAllChildren();
        this.wordNode.removeAllChildren();
        this.tempWordNode.getChildByName("tipErrNode").runAction(cc.hide())
    },

    init : function(c){
        this._controller = c
        this._plaerData = c.gameDataMgr.playerData
        this.gameConfig = c.gameConfig.json
        this.redPackConfig = c.redPackConfig.json
        this._initView()
        if(this._controller.gameDataMgr.red_pack){
            this.hongbaoNode.active = false;
        }
    },

    _initView:function(){
        this.lab_level.string = "第"+(parseInt(this._plaerData.level)+1)+"关"
        this.lab_redpack.string = this._plaerData.redPack.toFixed(2)
        this.lab_gold.string = this._plaerData.gold
        this.redpack_progress.progress = this._plaerData.redPack/100;
    },

    refreshGoldUI:function(){
        var self = this;
        var gold = this.lab_gold.string;
        if(this._plaerData.gold>parseInt(gold)){
            var dunm = parseInt((this._plaerData.gold-parseInt(gold))/5)
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
                    self.lab_gold.string = self._plaerData.gold;
                })
            ))
        }else{
            this.lab_gold.string = this._plaerData.gold
        }
    },

    refreshResPackUI:function(){
        this.lab_redpack.string = this._plaerData.redPack.toFixed(2)
    },

    clearn:function(){
        this.wordslist = [];
        this.bottomItemsList = [];
        this.bottomNode.removeAllChildren();
        this.wordNode.removeAllChildren();
        this.tempWordNode.getChildByName("tipErrNode").runAction(cc.hide())
        this._plaerData = this._controller.gameDataMgr.playerData
    },

    _initGeneralView : function(){
        this.clearn()
        this._initView()
        var gamelv = this._plaerData.level
        var data = this.cfgdata = this.gameConfig[gamelv]
        if(!data){
            data = this._controller.creatrGameConfigData()
        }
        var strlist = data.words.join("").split('').disorder()
        for (let i = 0; i < strlist.length; i++) {
            let item = cc.instantiate(this.bottomItem)
            item.getComponent("WordItem").init(strlist[i],this)
            this.bottomNode.addChild(item)
            this.bottomItemsList.push(item)
        };
        var showIdx = -1;
        if(this.redPackConfig[gamelv]){
            showIdx = Global.getRandomWithMinToMax(0,data.words.length-1)
        }
        for (let i = 0; i < data.words.length; i++) {
            let item = cc.instantiate(this.wordItem)
            item.getComponent("WordNodeItem").init(data.words[i],this)
            this.wordslist.push(item)
            this.wordNode.addChild(item)
            if(showIdx == i){
                item.getComponent("WordNodeItem").showRedPack(this.redPackConfig[gamelv])
            }
        };
    },

    _initActivityView : function(){
        var gamelv = this._plaerData.level
        var data = this.cfgdata = this.gameConfig[gamelv]
        var strlist = data.words.join("").split('').disorder()
        this.wordsIdx = 0
        for (let i = 0; i < strlist.length; i++) {
            let item = cc.instantiate(this.bottomItem)
            item.getComponent("WordItem").setLabWord(strlist[i])
            this.bottomNode.addChild(item)
            this.bottomItemsList.push(item)
        };
        for (let i = 0; i < data.words.length; i++) {
            let item = cc.instantiate(this.wordItem)
            item.getComponent("WordNodeItem").init(data.words[i],this)
            this.wordslist.push(item)
            this.wordNode.addChild(item)
            item.active = false
        };
        this.wordslist[this.wordsIdx].active = true
        this.wordslist[this.wordsIdx].getComponent("WordNodeItem").onTips()
    },


    onBottomBtnTouch:function(target){
        cc.log("this.string = ",target.word)
        this.musicMgr.playerItemSound()
        if(!this.tempWordNode.getComponent("tempWordNode").isFitWords()){
            target.getComponent("WordItem").setTouchState(false)
        }
        this.tempWordNode.getComponent("tempWordNode").pushWord(target)
    },

    onBtnSure:function(event){

        let endWords = this.tempWordNode.getComponent("tempWordNode").getEndWords()
        if(this.gameType === Global.GAME_TYPE_GENERAL){
            let data = this.cfgdata
            if(data.words.indexOf(endWords)<0){
                this.tempWordNode.getChildByName("tipErrNode").runAction(AC.blinkWithOut(0.1,3))
                this.musicMgr.playerErrorSound()
                cc.log("没有这个词")
                return
            }

            for (let i = 0; i < this.wordslist.length; i++) {
                if(this.wordslist[i].words == endWords){
                    if(this.wordslist[i].state == 0){
                        this.wordslist[i].getComponent("WordNodeItem").setFinished()
                        this.tempWordNode.getComponent("tempWordNode").cleanLayout()
                    }else{
                        this.wordslist[i].runAction(AC.rockAction(0.05,5))
                    }
                    this.musicMgr.playerOkSound()
                    break
                }
            };
        }else if(this.gameType === Global.GAME_TYPE_ACTIVITY){
            let data = this.cfgdata
            if(data.words[this.wordsIdx] === endWords){
                this.wordslist[this.wordsIdx].getComponent("WordNodeItem").setFinished()
                this.tempWordNode.getComponent("tempWordNode").cleanLayout()
                this.wordsIdx++
                this.wordslist[this.wordsIdx].active = true
                this.wordslist[this.wordsIdx].getComponent("WordNodeItem").onTips()
            }
        }
        this.checkGameEnd()
    },

    startGame : function(type){
        this.node.active = true
        this.gameType = type
        if(type === Global.GAME_TYPE_GENERAL){
            this._initGeneralView()
        }else if(type === Global.GAME_TYPE_ACTIVITY){
            this._initActivityView()
        }
    },

    tipWords : function(){
        this.musicMgr.playButtonSound()
        if(this._plaerData.gold<100){
            this.tips.show("金币不足")
            return
        }
        if(this.gameType === Global.GAME_TYPE_GENERAL){
            for (let i = 0; i < this.wordslist.length; i++) {
                if(this.wordslist[i].state == 0){
                    this.wordslist[i].getComponent("WordNodeItem").onTips()
                    break
                }
            };
        }else if(this.gameType === Global.GAME_TYPE_ACTIVITY){
            this.wordslist[this.wordsIdx].getComponent("WordNodeItem").onTips()
            if(this.wordslist[this.wordsIdx].state == 1){
                this.wordsIdx++
                this.wordslist[this.wordsIdx].active = true
                this.wordslist[this.wordsIdx].getComponent("WordNodeItem").onTips()
            }
        }
        this._controller.gameDataMgr.updateGold(-100);
        this.checkGameEnd()
    },

    refreshBottom:function(){
        this.musicMgr.playButtonSound()
        this.bottomItemsList.disorder()
        for (let i = 0; i < this.bottomItemsList.length; i++) {
            let item = this.bottomItemsList[i]
            item.parent = this.node
            item.parent = this.bottomNode
        };
        for (let i = 0; i < this.bottomItemsList.length; i++) {
            let item = this.bottomItemsList[i]
            if(!item.touchState){
                item.parent = this.node
                item.parent = this.bottomNode
            }
        };
    },

    checkGameEnd:function(){
        var gameend = true;
        for (var i = 0; i < this.wordslist.length; i++) {
            var item = this.wordslist[i];
            cc.log("item.node.state = ",item.state)
            if(!item.state){
                gameend = false;
            }
        };
        if(gameend){
            this._controller.onModelGameEnd()
            this._controller.gameDataMgr.addLevel()
            this._controller.gameDataMgr.updateGold(5);
            this.musicMgr.playerWinSound()
            //此时level已经更新，所以要减一级
            if(this.redPackConfig[this._plaerData.level-1]){
                 this._controller.onModelRedPack()
            }
        }
    }
});
