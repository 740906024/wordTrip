var encrypt=require("encryptjs")
var secretkey= 'open_sesame'; // 加密密钥
cc.Class({
    extends: cc.Component,

    properties: {
        playerData : null,    //玩家基本数据
        _db:null
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame
    init: function (c,cb) {
         var self = this;
         self._controller = c

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.cloud.init({})
            self._db = wx.cloud.database()
            self._db.collection('config_01').get({
                success: function(res){
                    var data = res.data[0];
                    if(data){
                        self.red_pack = data.red_pack
                        cc.log("data = ",data)
                        self.initPlayerDataWX(cb);
                    }else{
                        self.red_pack = true;
                         self.initPlayerDataWX(cb);
                    }

                },
            })
        }else{
            self.red_pack = true;
            self.initPlayerData();
            cb()
            // self.initPlayerDataWX(cb);
        }
    },
    initPlayerDataWX:function(cb){
       var self = this;
       self._db.collection('player').where({
            _openid: 'user-open-id',
        })
       .get({
           success: function(res) {
              cc.log("res.data")
              var data = res.data[0];
              if(data){
                  self.playerData = data;
                  self.newPlayer = self.playerData.newPlayerRedPack;
                  cb()
              }else{
                  var playerData = {
                      level:0,     //当前等级
                      redPack:0,     //当前红包数额
                      gold:200,            //当前金币
                      loginRewardTime:0,    //登陆奖励领取时间
                      zhuangPanAdTime:0,    //转盘奖励领取时间
                      newPlayerRedPack:true    //新手红包
                  }
                  self.newPlayer = playerData.newPlayerRedPack;
                  self._db.collection("player").add({
                    data:playerData,
                    success:function(res){
                      console.log('addNewPlayer success')
                    }
                 })
                  self.initPlayerData(playerData);
                  self.playerData = playerData;
                  cb();
              }
            }
        })
    },

    initPlayerData:function(data){
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            this.playerData = data
            this.newPlayer = true;
            this.savePlayerData("playerData")
        }else{
            var loadData = this.loadPlayerData("playerData")
            if(loadData){
                this.playerData = loadData
            }else{
                this.playerData = {
                      level:0,     //当前等级
                      redPack:0,     //当前红包数额
                      gold:200,            //当前金币
                      loginRewardTime:0,    //登陆奖励领取时间
                      zhuangPanAdTime:0,    //转盘奖励领取时间
                      newPlayerRedPack:true    //新手红包
                  }
                this.newPlayer = true;
                this.savePlayerData("playerData")
            }
        }

    },

    savePlayerData:function(tempstr){
        this[tempstr].timestamp = (new Date()).valueOf();
        var dataString = JSON.stringify(this[tempstr]);
        var encrypted = encrypt.encrypt(dataString,secretkey,256);
        cc.sys.localStorage.setItem(tempstr, encrypted);
    },

    loadPlayerData:function(tempstr){
        var temp = cc.sys.localStorage.getItem(tempstr)
        if(temp){
            var mydata = JSON.parse(encrypt.decrypt(temp,secretkey,256))
            return mydata
        }
        return null
    },

    addLevel:function(){
        var self = this;
        self.playerData.level++;
        this.savePlayerData("playerData")
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            self._db.collection("player")
            .where({
               _openid: 'user-open-id',
             })
            .update({
                data:{
                    level:self.playerData.level
                },
                success:function(res){
                  console.log('saveState addLevel success')
                }
            })
        }
    },

    addRedPack:function(num){
        var self = this;
        self.playerData.redPack += num;
        cc.log("self.playerData.redPack = ",self.playerData.redPack,num)
        cc.find('Canvas/gameNode').getComponent("Game").refreshResPackUI()
        this.savePlayerData("playerData")
        this.updateHomePage()
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            self._db.collection("player")
            .where({
               _openid: 'user-open-id',
             })
            .update({
                data:{
                    redPack:self.playerData.redPack
                },
                success:function(res){
                  console.log('saveState addRedPack success')
                }
            })
        }
    },

    updateGold:function(num){
        var self = this;
        self.playerData.gold += num;
        cc.find('Canvas/gameNode').getComponent("Game").refreshGoldUI()
        this.savePlayerData("playerData")
        this.updateHomePage()
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            self._db.collection("player")
            .where({
               _openid: 'user-open-id',
             })
            .update({
                data:{
                    gold:self.playerData.gold
                },
                success:function(res){
                  console.log('saveState updateGold success')
                }
            })
        }
    },

    refreshLoginRewardTime:function(){
        var self = this;
        self.playerData.loginRewardTime = Global.getDayInt();
        this.savePlayerData("playerData")
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            self._db.collection("player")
            .where({
               _openid: 'user-open-id',
             })
            .update({
                data:{
                    loginRewardTime:self.playerData.loginRewardTime
                },
                success:function(res){
                  console.log('saveState refreshLoginRewardTime success')
                }
            })
        }
    },

    refreshZhuanPanTime:function(){
        var self = this;
        self.playerData.zhuangPanAdTime = Global.getDayInt();
        this.savePlayerData("playerData")
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            self._db.collection("player")
            .where({
               _openid: 'user-open-id',
             })
            .update({
                data:{
                    zhuangPanAdTime:self.playerData.zhuangPanAdTime
                },
                success:function(res){
                  console.log('saveState refreshZhuanPanTime success')
                }
            })
        }
    },

    getNewPlayerRedPack:function(){
        var self = this;
        self.playerData.newPlayerRedPack = false;
        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            self._db.collection("player")
            .where({
               _openid: 'user-open-id',
             })
            .update({
                data:{
                    newPlayerRedPack:false
                },
                success:function(res){
                  console.log('saveState refreshZhuanPanTime success')
                }
            })
        }
    },

    updateHomePage:function(){
        cc.find('Canvas/homepage').getComponent("HomePageMgr").refreshView()
    }
});
