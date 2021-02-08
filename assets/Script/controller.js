var AdsMgr = require("AdsManager");
cc.Class({
    extends: cc.Component,

    properties: {
        gameDataMgr : require("GameDataMgr"), //数据控制中心
        musicMgr : require('MusicMgr'), //音乐控制组件
        homeMgr : require("HomePageMgr"), //主页控制器
        game : require("Game"), // 主游戏控制器
        gameConfig : cc.JsonAsset,
        redPackConfig : cc.JsonAsset,
        modelHelp:cc.Node,
        modelGameEnd:cc.Node,
        modelRedPack:cc.Node,
        modelSettings:cc.Node,
        modelLoginReward:cc.Node,
        modelZhuanPan:cc.Node,
    },

    // use this for initialization
    start: function () {
        var self = this;
        this.AdsMgr = AdsMgr;
        this.AdsMgr.loadAds();
        this.homeMgr.node.active = false
        this.game.node.active = false
        this.modelHelp.active = false;
        this.modelGameEnd.active = false;
        this.gameDataMgr.init(this,function(){
            self.init()
        })

        this.wordList = ["春暖花开","十字路口","千军万马","白手起家","张灯结彩","风和日丽","万里长城","人来人往","自由自在","瓜田李下","助人为乐","红男绿女","春风化雨","马到成功","拔苗助长","安居乐业","走马观花","念念不忘","落花流水","一往无前","落地生根","天罗地网","东山再起","一事无成","山清水秀","语重心长","别有洞天","水深火热","鸟语花香","自以为是","两面三刀","独树一帜","脱口而出","推陈出新","漫不经心","滴水穿石","斤斤计较","五彩缤纷","五谷丰登","哄堂大笑","弱肉强食","指手画脚","九牛一毛","过眼云烟","勾心斗角","志同道合","日积月累","枯木逢春","小题大做","四海为家","出尔反尔","轰轰烈烈","纹丝不动","另眼相看","丰功伟绩","举世闻名","寿比南山","求之不得","一知半解","胸无城府","盘根错节","艰苦卓绝","拨云见日","明知故犯","凡夫俗子","煮豆燃萁","骨瘦如柴","人困马乏","形单影只","悲喜交集","其貌不扬","理所当然","添砖加瓦","不折不扣","倾盆大雨","心烦意乱","高枕无忧","迷惑不解","出乎意料","悲欢离合","千姿百态","封妻荫子","并驾齐驱","若有所思","慢条斯理","百战百胜","切肤之痛","扭转乾坤","含苞欲放","不毛之地","冥思苦想","记忆犹新","烟波浩渺","巍然屹立","浪子回头","谆谆教导","变幻莫测","等因奉此","人杰地灵","贪得无厌","不可开交","举世瞩目","陈词滥调","触目伤怀","乐不可支","沸沸扬扬","孔武有力","赫赫有名","回味无穷","满载而归","天灾人祸","力所能及","罪魁祸首","摇摇欲坠","非同小可","承前启后","出谋划策","容光焕发","欢呼雀跃", "神采飞扬","口干舌燥","严惩不贷","锦绣前程","崭露头角","光阴荏苒","以偏概全","如法炮制","半身不遂","绿树成荫","啼笑皆非","暴戾恣睢","毁家纾难","和衷共济","大义凛然","掎角之势","迥然不同","寥寥无几","一厢情愿","漠不关心","喧宾夺主","徇私舞弊","出奇制胜","牵强附会","如愿以偿","骄阳似火","涣然冰释","自暴自弃","无事生非","孺子可教","灰飞烟灭","信誓旦旦","蒸蒸日上","酩酊大醉","混世魔王","杜鹃啼血","长歌当哭","起死回生","投机倒把","形形色色","不经之谈","无精打采","气势磅礴","晓风残月","不翼而飞","如花似玉","冥顽不灵","伤天害理","数见不鲜","自食其力","毅然决然","便宜行事","择善而从","纷纷扬扬","殒身不恤","等闲视之","风流人物","冷若冰霜","伯仲之间","顾盼神飞"]
        for(let id in this.gameConfig.json){
            this.wordList = this.wordList.concat(this.gameConfig.json[id].words)
        }
    },

    init:function(){
        this.modelGameEnd.getComponent("EndGame").init(this)
        this.modelRedPack.getComponent("RedPack").init(this)
        this.modelLoginReward.getComponent("LoginReward").init(this)
        this.modelZhuanPan.getComponent("zhuanpan").init(this)
        this.homeMgr.init(this)
        this.game.init(this)
    },

    // called every frame
    update: function (dt) {

    },

    startGame:function(type){
        this.AdsMgr.hideBannerAd()
        this.musicMgr.playButtonSound()
        this.gameDataMgr.gameType = type
        this.homeMgr.node.active = false
        this.game.startGame(type)
    },

    onMenuLayer:function(){
        this.AdsMgr.showBannerAd()
        this.musicMgr.playButtonSound()
        this.homeMgr.node.active = true
        this.game.node.active = false
    },

    onModelHelp:function(){
        this.AdsMgr.showBannerAd()
        this.musicMgr.playButtonSound()
        this.modelHelp.active = true;
    },

    onModelRedPack:function(){
        this.AdsMgr.showBannerAd()
        if(this.gameDataMgr.red_pack){
            return
        }
        this.musicMgr.playButtonSound()
        this.modelRedPack.getComponent("RedPack").show()
    },

    onModelSettings:function(){
        this.musicMgr.playButtonSound()
        this.modelSettings.active = true;
    },

    onModelGameEnd:function(){
        this.AdsMgr.showBannerAd()
        this.musicMgr.playButtonSound()
        // this.modelGameEnd.active = true;
        this.modelGameEnd.getComponent("EndGame").show(this.gameConfig.json,this.gameDataMgr.playerData)
    },

    onModelLoginReward:function(){
        this.AdsMgr.showBannerAd()
        this.musicMgr.playButtonSound()
        this.modelLoginReward.getComponent("LoginReward").show()
    },

    onModelZhuanPan:function(){
        this.AdsMgr.showBannerAd()
        this.musicMgr.playButtonSound()
        this.modelZhuanPan.getComponent("zhuanpan").show()
    },


    closeModel:function(event){
        this.AdsMgr.hideBannerAd()
        this.musicMgr.playButtonSound()
        var target = event.target
        target.parent.active = false;
    },

    nextGame:function(){
         this.AdsMgr.hideBannerAd()
        this.musicMgr.playButtonSound()
        this.startGame(this.gameDataMgr.gameType)
    },

    creatrGameConfigData:function(){
        this.wordList.disorder();
        var words = []
        for (var i = 0; i < 6; i++) {
            words.push(this.wordList[i])
        };
        return {words:words}
    }
});
