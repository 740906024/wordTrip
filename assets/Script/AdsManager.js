const bannerId = "adunit-29cbb548277189e7"
const rewardVideoId = "adunit-d12526a181c239fe"
var AdsMgr = {
	_bannerloaded : false,
	_bannerAd:null,
	_videoAd:null,
	loadAds:function(cb){
		var cb = cb || function(){};
		if (cc.sys.platform !== cc.sys.WECHAT_GAME){
			return
		}
		this._loadBannerAd(cb);
	    this._loadRewardedVideoAd();
	},

	_loadBannerAd:function(cb){
        var self = this;
        const systemInfo = wx.getSystemInfoSync();
        this._bannerAd = wx.createBannerAd({
          adUnitId: bannerId,
          adIntervals: 30,
          style: {
              left: 3,
              top:0,
              width: systemInfo.windowWidth-6,
          }
        })

        this._bannerAd.onError(function(res){
            console.log("bannerAd")
            console.log(res)
            cb()
        })

        this._bannerAd.onResize(res => {
            self._bannerAd.style.top = systemInfo.windowHeight - self._bannerAd.style.realHeight - 5;
        })

        this._bannerAd.onLoad(function(){
        	self._bannerloaded = true;
        	cb()
        })
    },



    _loadRewardedVideoAd:function(){
        var self = this;
        // 创建激励视频广告实例，提前初始化
       this._videoAd = wx.createRewardedVideoAd({
          adUnitId: rewardVideoId
        })

        this._videoAd.onError(function(res){
            console.log("videoAd")
            console.log(res)
        })

        this._videoAd.onClose(function(res){
            cc.log("关闭奖励广告",res)
            if(res.isEnded && self.rewardAdCallback){
                self.rewardAdCallback();
                self.rewardAdCallback = null;
            }
        })

        this._videoAd.onLoad(function(res){
            cc.log("视屏广告加载成功",res)
        })
    },

    showBannerAd:function(){
        if(this._bannerloaded){
            this._bannerAd.show()
        }
    },

    hideBannerAd:function(){
        if(this._bannerloaded){
            this._bannerAd.hide()
        }
    },

    showRewardedVideoAd:function(cb){
        this.rewardAdCallback = cb;
        this._videoAd.show().catch(() => {
          // 失败重试
          this._videoAd.load()
            .then(() => this._videoAd.show())
            .catch(err => {
              console.log('激励视频 广告显示失败')
              wx.showModal({
                  title: 'Sorry',
                  content: '广告加载失败~',
                })
            })
        })
    }
}

module.exports= AdsMgr;