cc.Class({
    extends: cc.Component,

    properties: {
        _labNum:0
    },

    // use this for initialization
    onLoad: function () {
        this._labNum = Math.ceil(Math.random()*10);
    },

    // called every frame
    update: function (dt) {

    },

    itemPlay:function(){
       this.times--
        if (this.times > 0) {
            var action = this.node.getComponent(cc.Animation)
            action.play()
            this.node.getChildByName("00").getChildByName("lab").getComponent(cc.Label).string = this.getLabNum()
            this.node.getChildByName("01").getChildByName("lab").getComponent(cc.Label).string = this.getLabNum()
        }else if(this.times == 0){
            this.node.getChildByName("00").getChildByName("lab").getComponent(cc.Label).string = this.num;
            this.node.getChildByName("01").getChildByName("lab").getComponent(cc.Label).string = this.num;
            this.game.finished()
        }
    },

    startPlay:function(times,num,game){
         cc.log("times = ",times)
        this.times = times
        this.num = num
        this.game = game
        var action = this.node.getComponent(cc.Animation)
        action.play()
    },

    getLabNum:function(){
        this._labNum++;
        return ""+this._labNum%10;
    }
});
