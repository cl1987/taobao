(function($){
	//运用面向对象的方法
	function Tab($elem,options){//这是个构造函数
		// console.log(this)
		//1.罗列属性
		this.$elem=$elem;
		this.options=options;
		this.$tabItems=this.$elem.find('.tab-item')
		this.$tabPanels=this.$elem.find('.tab-panel')
		this.$itemLength=this.$tabItems.length
		this.now=this._getCorrectIndex(this.options.activeIndex) 
		this.timer=0;
		
		//2.初始化
		this.init();
		// console.log(this.$layer)
	}
	Tab.prototype={//构造函数的原型对象
		constructor:Tab,
		init:function(){
			var _this=this
			//1.选项卡默认被选中
			this.$tabItems.eq(this.now).addClass('tab-item-active');
			this.$tabPanels.eq(this.now).show();
			//2.初始化显示隐藏插件
			this.$tabPanels.showHide(this.options);
			//3.监听选项卡显示隐藏插件
			this.$elem.trigger('tab-show',[this.now,this.$tabPanels.eq(this.now)]);
			this.$tabPanels.on('show',function(ev){
				_this.$elem.trigger('tab-show',[_this.$tabPanels.index(this),this]);
			})
			//3.判断事件类型
			var eventType=""
			if(this.options.eventName=='click'){
				eventType='click'
			}else{
				eventType='mouseenter'
			}
			//4.事件代理监听事件
			this.$elem.on(eventType,'.tab-item',function(){
				var index=_this.$tabItems.index(this)//这里的this为什么是不一样的
				_this._toggle(index)
			})
			//5.是否自动轮播
			if(this.options.autoplay){
				this.autoplay();
				//6.鼠标移入容器停止轮播移出开始轮播
				this.$elem.hover($.proxy(this.paused,this),$.proxy(this.autoplay,this))
			}
		},
		_toggle:function(index){
			//index代表即将显示的下标
			this.$tabItems.eq(this.now).removeClass('tab-item-active');
			this.$tabPanels.eq(this.now).showHide('hide');
			this.$tabItems.eq(index).addClass('tab-item-active');
			this.$tabPanels.eq(index).showHide('show');
			this.now=index;
		},
		_getCorrectIndex:function(num){
			if(num >= this.$itemLength) return 0;
			if(num <0) return this.$itemLength-1;
			return num;
		},
		autoplay:function(){
			clearInterval(this.timer)
			this.timer=setInterval(function(){
				this._toggle(this._getCorrectIndex(this.now+1))
			}.bind(this),this.options.autoplay)
		},
		paused:function(){
			clearInterval(this.timer)
		}
	}
	//不传参数时的默认配制信息
	Tab.DEFAULTS={
		activeIndex:0,
		js:true,
		mode:'slide',
		eventName:'click',
		autoplay:0
	}
	//封装coursel插件
	$.fn.extend({
		tab:function(options){
			//实现隐式迭代
			this.each(function(){
				// console.log(this)这里的this是每一个dom节点
				var $elem=$(this);
				// console.log("111111",$elem)
				var tab=$elem.data('tab')
				if(!tab){
					options=$elem.extend({},Tab.DEFAULTS,options);
					//通过tab new出来的实例才可以调用tab上面的一些方法
					tab=new Tab($elem,options);
					//将实例信息储存在dom节点上
					$elem.data('tab',tab)
				}
				//第二次调用tab,则是调用实例上的方法
				if(typeof tab[options]=='function' ){
					tab[options]();
				}
			})
		}
	})
})(jQuery)