(function($){
	//运用面向对象的方法
	function Coursel($elem,options){//这是个构造函数
		console.log(this)
		//1.罗列属性
		this.$elem=$elem;
		this.options=options;
		this.$courselItems=this.$elem.find('.carousel-item');
		this.$courselBtn=this.$elem.find('.btn-item');
		this.$courselControls=this.$elem.find('.control');
		this.$itemLength=this.$courselItems.length
		this.now=this._getCorrectIndex(this.options.activeIndex) 
		this.timer=0;
		
		//2.初始化
		this.init();
		// console.log(this.$layer)
	}
	Coursel.prototype={//构造函数的原型对象
		constructor:Coursel,
		init:function(){
			if(this.options.slide){//划入划出

			}else{//淡入淡出
				//1.隐藏所有图片，默认显示第一张
				this.$elem.addClass('fade')
				this.$courselItems.eq(this.now).show()
				//2.底部按钮默认被选中
				this.$courselBtn.eq(this.now).addClass('active')
				//3.监听鼠标移入移除显示左右按钮
				this.$elem.hover(function(){
					this.$courselControls.show()
				}.bind(this),function(){
					this.$courselControls.show()
				}.bind(this))
				//初始化显示隐藏插件
				this.$courselItems.showHide(this.options)//this.options是什么参数
				//4.事件代理。。监听点击左右按钮显示隐藏图片
				this.$elem.on('click','.control-left',function(){
					this._fade(this._getCorrectIndex(this.now-1))
				}.bind(this))
				this.$elem.on('click','.control-right',function(){
					this._fade(this._getCorrectIndex(this.now+1))
				}.bind(this))
				//5.是否自动轮播
				if(this.options.autoplay){
					//6.放入停止，移除开始
					this.autoplay()
					this.$elem.hover($.proxy(this.paused,this),$.proxy(this.autoplay,this))
				}
				//7.监听底部按钮事件
				var _this=this
				this.$courselBtn.on('click',function(){
					var index=_this.$courselBtn.index(this)
					_this._fade(index)
				})
			}
		},
		_fade:function(index){
			//如果即将显示的和当前相同则不需要继续加载_fade函数
			if(index==this.now) return
				// console.log(1111)
			//1.隐藏当前的
			this.$courselItems.eq(this.now).showHide('hide')
			//2.显示将要显示的
			this.$courselItems.eq(index).showHide('show')
			//3.底部按钮更新
			this.$courselBtn.eq(this.now).removeClass('active')
			this.$courselBtn.eq(index).addClass('active')
			//4.更新索引值
			this.now=index
		},
		_getCorrectIndex:function(num){
			if(num >= this.$itemLength) return 0;
			if(num <0) return this.$itemLength-1;
			return num;
		},
		autoplay:function(){
			clearInterval(this.timer)
			this.timer=setInterval(function(){
				this.$courselControls.eq(1).trigger('click');
			}.bind(this),this.options.autoplay)
		},
		paused:function(){
			clearInterval(this.timer)
		}
	}
	//不传参数时的默认配制信息
	Coursel.DEFAULTS={
		slide:false,
		activeIndex:0,
		js:true,
		mode:'fade',
		autoplay:1000
	}
	//封装coursel插件
	$.fn.extend({
		coursel:function(options){
			//实现隐式迭代
			this.each(function(){
				// console.log(this)这里的this是每一个dom节点
				var $elem=$(this);
				// console.log("111111",$elem)
				var coursel=$elem.data('coursel')
				if(!coursel){
					options=$elem.extend({},Coursel.DEFAULTS,options);
					//通过coursel new出来的实例才可以调用coursel上面的一些方法
					coursel=new Coursel($elem,options);
					//将实例信息储存在dom节点上
					$elem.data('coursel',coursel)
				}
				//第二次调用coursel,则是调用实例上的方法
				if(typeof coursel[options]=='function' ){
					coursel[options]();
				}
			})
		}
	})
})(jQuery)