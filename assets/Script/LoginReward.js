cc.Class({
    extends: cc.Component,

    properties: {
        itemArr:{
            default: [],
            type: cc.Node
        },
        btnLinqu:cc.Node,
        btnAd:cc.Node,
        btnBegin:cc.Node,
        labLinqu:cc.Node,
        _actionTimes:20,
        _labNum:0,
        _goldNum:0,
        _fidx:0
    },

    init:function(c){
    	var date = new Date();
		var nowDate = date.getDate();//获取当前日(1-31)
		var day = date.getDay();//获取当前星期X(0-6,0代表星期天)
		var num = nowDate*2+(day+1)*5;
		if(num<10){
			 this._goldNum = "00"+num;
		}else if(num<100){
			 this._goldNum = "0"+num
		}else{
			 this._goldNum = ""+num
		}
        this._controller = c
        this.playerData = c.gameDataMgr.playerData
        var dayInt = Global.getDayInt()
        cc.log("loginRewardTime = ",this.playerData.loginRewardTime,dayInt)
        if(this.playerData.loginRewardTime<dayInt){
        	this.btnBegin.active = true;
        	this.btnAd.active = false;
        	this.btnLinqu.active = false;
        	this.labLinqu.active = false;
        	this.show()
        }else{
        	this.btnBegin.active = false;
        	this.btnAd.active = false;
        	this.btnLinqu.active = false;
        	this.labLinqu.active = true;
        	for (var i = 0; i < this.itemArr.length; i++) {
	    		this.itemArr[i].getChildByName("00").getChildByName("lab").getComponent(cc.Label).string = this._goldNum[i];
            	this.itemArr[i].getChildByName("01").getChildByName("lab").getComponent(cc.Label).string = this._goldNum[i];
	    	};
        }
    },

    show:function(){

        this.node.active = true;
    },

    // use this for initialization
    onLoad: function () {

    },

    onStartPlay:function(){
    	if(this._touch){
    		return
    	}
    	this._touch = true
    	this._actionTimes--;
    	for (var i = 0; i < this.itemArr.length; i++) {
    		this.itemArr[i].getComponent("lhj").startPlay(i*2+4,this._goldNum[i],this)
    	};
	},

	finished:function(){
		this._fidx++
		if(this._fidx>=3){
			this.btnBegin.active = false;
        	this.btnAd.active = true;
        	this.btnLinqu.active = true;
        	this.labLinqu.active = false;
        	this._touch = false
		}
	},

	onReceived:function(){
		this.node.active = false;
		this._controller.gameDataMgr.updateGold(parseInt(this._goldNum));
		this._controller.gameDataMgr.refreshLoginRewardTime();
		this.btnBegin.active = false;
    	this.btnAd.active = false;
    	this.btnLinqu.active = false;
    	this.labLinqu.active = true;
	},

	onReceivedAd:function(){
		var self = this;
		this._controller.AdsMgr.showRewardedVideoAd(function(){
    		self.showAds()
    	})
	},

	showAds:function(){
		this.node.active = false;
		this._controller.gameDataMgr.updateGold(parseInt(this._goldNum*3));
		this._controller.gameDataMgr.refreshLoginRewardTime();
		this.btnBegin.active = false;
    	this.btnAd.active = false;
    	this.btnLinqu.active = false;
    	this.labLinqu.active = true;
	}

});
