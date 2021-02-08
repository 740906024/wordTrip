cc.Class({
    extends: cc.Component,

    properties: {
        volume : 0.5,
        bgMusic: cc.AudioClip,
        buttonSound:cc.AudioClip,
        touchItemSound:cc.AudioClip,
        errorSound:cc.AudioClip,
        okSound:cc.AudioClip,
        winSound:cc.AudioClip,
        hongbao:cc.AudioClip
    },

    // use this for initialization
    start: function () {
        cc.audioEngine.playMusic(this.bgMusic,true)
    },

    soundSlide:function(slider){
        cc.audioEngine.setMusicVolume(slider.progress);
    },

    effectSlide:function(slider){
        cc.audioEngine.setEffectsVolume(slider.progress);
    },

    pauseBg: function() {
        cc.audioEngine.pauseMusic()
    },
    resumeBg: function() {
        cc.audioEngine.resumeMusic()
    },

    playButtonSound:function(){
        cc.audioEngine.playEffect(this.buttonSound);
    },

    playerItemSound:function(){
        cc.audioEngine.playEffect(this.touchItemSound);
    },

    playerOkSound:function(){
        cc.audioEngine.playEffect(this.okSound);
    },

    playerErrorSound:function(){
        cc.audioEngine.playEffect(this.errorSound);
    },

    playerWinSound:function(){
        cc.audioEngine.playEffect(this.winSound);
    },

    playerHongbaoSound:function(){
        cc.audioEngine.playEffect(this.hongbao);
    }
});