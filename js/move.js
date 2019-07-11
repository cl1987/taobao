(function($){
	function init($elem){
		this.$elem=$elem;
		this.$elem.removeClass('transition')
		this.currentX=parseFloat(this.$elem.css('left'))
		this.currentY=parseFloat(this.$elem.css('top'))
	}

	function to(x,y,callback){
		x = (typeof x=="number") ? x : this.currentX
		y = (typeof y=="number") ? y : this.currentY
		if(this.currentX==x && this.currentY==y) return; 
		// console.log(111)
		this.$elem.trigger('move')
		typeof callback=='function' && callback() 
		this.$elem.trigger('moved')
		//更新当前元素的位置
		this.currentX=x
		this.currentY=y
	}

	function Slide($elem){//这是个构造函数constructor
		init.call(this,$elem)
	}
	Slide.prototype={
		constructor:Slide,
		to:function(x,y){
			to.call(this,x,y,function(){
				this.$elem.css({
				left:x,
				top:y
				}.bind(this))
			}.bind(this))
		},
		x:function(x){
			this.to(x)
		},
		y:function(y){
			this.to(null,y)
			console.log(111)
		}
	}
	function Js($elem){//这是个构造函数constructor
		init.call(this,$elem)
	}
	Js.prototype={
		constructor:Js,
		to:function(x,y,callback){
			to.call(this,x,y,function(){
				this.$elem
				.stop()
				.animate({
					left:x,
					top:y
				},function(){
					this.$elem.trigger('moved')
				}.bind(this))
			}.bind(this))
		},
		x:function(x){
			this.to(x)
		},
		y:function(y){
			this.to(null,y)
		}
	}
	//返回执行动画的方法
	function getmove($elem,options){
		// var showHideFn=slient;
		// if(options.js){
		// 	showHideFn=js[options.mode]
		// }
		// //初始化，防止用户多次点击
		// showHideFn.init($elem);

		// //返回对应的显示隐藏方法
		// return {
		// 	show:showHideFn.show,
		// 	hide:showHideFn.hide
		// }
		var move=null;
		if(options.js){
			move=new Js($elem)
		}else{
			move=new Slide($elem);
		}
		return {
			to:move.to.bind(move),
			x:move.x.bind(move),
			y:move.y.bind(move)
		}
	}
	// 容错处理
	var DEFAULTS={
		js:true
	}
	//封装showHide插件
	$.fn.extend({
		move:function(options,x,y){
			//遍历元素实现隐式迭代
			return this.each(function(){//实现单例模式 暴露组件
				var $elem=$(this)
				var moveobj=$elem.data('moveobj')
				if(!moveobj){
					options= $.extend({},DEFAULTS,options)
					// 查看配置信息
					// console.log(options)
					moveobj=getmove($elem,options)
					// console.log(moveobj)
					$elem.data('moveobj',moveobj)	
				}
				//第二次进入该函数则是调用该函数
				if(typeof moveobj[options] == 'function'){
					moveobj[options](x,y)
				}
			})
		}
	})
})(jQuery)
	