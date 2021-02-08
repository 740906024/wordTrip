cc.Class({
    extends: cc.Component,

    properties: {
        pan: {
            default: null,
            type: cc.Node
        },
        luckNode:cc.Node,
        packNode:cc.Node,
        btnAd:cc.Node,
        labLinqu:cc.Node,
        btnBegin:cc.Node
        // defaults, set visually when attaching this script to the Canvas
    },

    init:function(c){
    	var date = new Date();
		var nowDate = date.getDate();//获取当前日(1-31)
		this.idx = nowDate%3
        this._controller = c
        this.playerData = c.gameDataMgr.playerData
        var dayInt = Global.getDayInt()
       if(this._controller.gameDataMgr.red_pack){
            this.packNode.active = false;
            this.luckNode.active = true;
        }else{
        	this.packNode.active = true;
            this.luckNode.active = false;
        }
        if(this.playerData.zhuangPanAdTime<dayInt){

        }else{
        	this.btnBegin.active = false;
        	this.btnAd.active = false;
        	this.labLinqu.active = true;
    		if(this._controller.gameDataMgr.red_pack && this.idx==1){
    			this.labLinqu.getComponent(cc.Label).string = "吉祥如意"
    		}
    		if(this.idx == 0){
    			this.pan.angle = -22.5
    		}else if(this.idx == 1){
    			this.pan.angle = -157.5
    		}else if(this.idx == 2){
    			this.pan.angle = 67.5
    		}
        }
    },

    // called every frame
    update: function (dt) {

    },

    show:function(){
    	this.node.active = true;
    },

    onBtnTouch:function(){
    	if(this.touch){
    		return
    	}
    	this.touch = true
        // this.pan.runAction(cc.rotateTo(2,360*5+22.5))
        // this.pan.runAction(cc.rotateTo(2,360*5+157.5))
        //
        var self = this;
        if(this.idx == 0){
        	this.pan.runAction(cc.sequence(cc.rotateTo(3,360*5+22.5).easing(cc.easeElasticOut(1.0)),cc.callFunc(self.actionEnd.bind(self)))) //88
        }else if(this.idx == 1){
        	this.pan.runAction(cc.sequence(cc.rotateTo(3,360*5+157.5).easing(cc.easeElasticOut(1.0)),cc.callFunc(self.actionEnd.bind(self)))) //
        }else if(this.idx == 2){
        	this.pan.runAction(cc.sequence(cc.rotateTo(3,360*5-67.5).easing(cc.easeElasticOut(1.0)),cc.callFunc(self.actionEnd.bind(self))))
        }
    },

    actionEnd:function(){
    	cc.log("this.idx = ",this.idx)
    	this.touch = false;
    	if(this._controller.gameDataMgr.red_pack){
    		if(this.idx == 1){
    			this.btnBegin.active = false;
	    		this.labLinqu.active = true;
	    		this.labLinqu.getComponent(cc.Label).string = "吉祥如意"
	    		this.btnAd.active = false;
    		}else{
    			this.btnBegin.active = false;
	    		this.labLinqu.active = false;
	    		this.btnAd.active = true;
    		}

    	}else{
    		this.btnBegin.active = false;
    		this.labLinqu.active = false;
    		this.btnAd.active = true;
    	}
    },

    onTouchAd:function(){
    	var self = this;
    	this._controller.AdsMgr.showRewardedVideoAd(function(){
    		self.showAds()
    	})

    },

    showAds:function(){
    	if(this.idx == 0){
    		this._controller.gameDataMgr.updateGold(88);
    	}else if(this.idx == 2){
    		this._controller.gameDataMgr.updateGold(108);
    	}else if(this.idx == 1){
    		if(!this._controller.gameDataMgr.red_pack){
    			this._controller.modelRedPack.getComponent("RedPack").showWithNum(0.01)
    		}
    	}
    	this.btnBegin.active = false;
		this.labLinqu.active = true;
		this.btnAd.active = false;
    	this.node.active = false;
    	this._controller.gameDataMgr.refreshZhuanPanTime();
    }
});
