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
        this.node.x = -300;
        this.state = "more"
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
	    	 wx.showShareMenu({
	          withShareTicket: true,
	          menus: ['shareAppMessage', 'shareTimeline']
	        })
	    	 var titlelist = [
	    	 	"天天成语，欢声笑语。",
	    	 	"小成语，大道理。",
	    	 	"成语中旅行，知识中翱翔。",
	    	 	"习语当下，大势所趋。",
	    	 	"品味成语之美，传承中华文明。"
	    	 ]
	         wx.onShareAppMessage(() => {
	            return {
	              title: titlelist[Global.getRandomWithMinToMax(0,titlelist.length-1)],
	              imageUrl: '1.pic.png', // 图片 URL
	            }
	          })
	        wx.onShareTimeline(() => {
	            return {
	              title: titlelist[Global.getRandomWithMinToMax(0,titlelist.length-1)],
	              imageUrl: '1.pic.png', // 图片 URL
	            }
	          })
        }
    },

    click:function(){
    	if(this.state == "more"){
    		this.more()
    	}else{
    		this.back()
    	}
    },
    // called every frame
    more: function () {
    	this.state = "back"
    	this.node.stopAllActions()
    	this.node.runAction(cc.moveTo(0.2,0,0))
    	this.label.string = "返\n回"
    },

    back:function(){
    	this.state = "more"
    	this.node.stopAllActions()
    	this.node.runAction(cc.moveTo(0.2,-300,0))
    	this.label.string = "更\n多"
    },

    navigateToOther:function(event, custom){
        wx.navigateToMiniProgram({
            appId:custom,
            extraData: {
                fromOther: true
            }
        })
    },
});