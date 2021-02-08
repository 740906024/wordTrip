var AC = require('actions')
cc.Class({
    extends: cc.Component,

    properties: {
        btn_icon: {
            default: null,
            type: cc.Node
        },

        lab_addNum: {
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

        infoNode:{
        	default:null,
        	type:cc.Node
        },

        tixianNode:{
            default:null,
            type:cc.Node
        }
    },

    onLoad:function(){
    	this.infoNode.active = false;
        this.tixianNode.active = false;
    },
    // use this for initialization
    start: function () {
        this.btn_icon.runAction(AC.heartBeat())
    },

    init:function(c){
    	this._controller = c
    	this.redPackConfig = c.redPackConfig.json
    	this.playerData = c.gameDataMgr.playerData
    },

    show:function(){
        if(this._controller.gameDataMgr.red_pack){
            return
        }
        this.tixianNode.active = false;
    	this.infoNode.active = false;
    	this.node.active = true;
    	this._touched = false;
    },

    showWithNum:function(num){
        if(this._controller.gameDataMgr.red_pack){
            return
        }
        this._touched = true;
        this.node.active = true;
        var addRedPackNum = num;
        this.lab_addNum.string = "+"+addRedPackNum.toFixed(2);
        var redpack = this.playerData.redPack+addRedPackNum;
        this.lab_redpack.string = redpack.toFixed(2);
        this.lab_redpack1.string = (100-redpack).toFixed(2);
        this.redpack_progress.progress = redpack/100;
        this.infoNode.active = true;
        this._controller.gameDataMgr.addRedPack(addRedPackNum)
    },

    hide:function(){
    	this.node.active = false;
    },

    btnTouch:function(){
    	if(this._touched){
    		return
    	}
    	this._touched = true
    	var addRedPackNum
    	if(this._controller.gameDataMgr.newPlayer){
            this._controller.gameDataMgr.getNewPlayerRedPack();
    		addRedPackNum = 13.86
    	}else{
    		addRedPackNum = this.redPackConfig[this.playerData.level-1]
    	}
        cc.log("addRedPackNum = ",addRedPackNum)
    	this.lab_addNum.string = "+"+addRedPackNum.toFixed(2);
    	var redpack = this.playerData.redPack+addRedPackNum;
    	this.lab_redpack.string = redpack.toFixed(2);
    	this.lab_redpack1.string = (100-redpack).toFixed(2);
        this.redpack_progress.progress = redpack/100;
    	this.infoNode.active = true;
    	this._controller.gameDataMgr.addRedPack(addRedPackNum)
    },

    tixian:function(){
        if(this._controller.gameDataMgr.red_pack){
            return
        }
        this._touched = true
        this.node.active = true;
        if(this.playerData.redPack>=100){
            this.infoNode.active = false;
            this.tixianNode.active = true;
        }else{
            var redpack = this.playerData.redPack;
            this.lab_addNum.string = redpack;
            this.lab_redpack.string = redpack;
            this.lab_redpack1.string = (100-redpack).toFixed(2);
            this.redpack_progress.progress = redpack/100;
            this.infoNode.active = true;
        }
    }
});
