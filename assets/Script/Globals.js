window.Global = {
	getRandomWithMinToMax : function(min,max){
	    return min + Math.floor(Math.random() * (max - min + 1));
	},
  getDayInt:function(){
    return parseInt((new Date().getTime())/86400000)
  },
  GAME_TYPE_GENERAL : 0,    //普通关卡类型
  GAME_TYPE_ACTIVITY: 1,    //活动关卡类型
};


//移除元素
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

//数组乱序
Array.prototype.disorder = function(){
	var arr = this
    for (var i = 0; i < arr.length; i++) {
        var num = Global.getRandomWithMinToMax(0,arr.length-i-1)
        var temp = arr[i]
        arr[i] = arr[num]
        arr[num] = temp
    };
    return arr
}