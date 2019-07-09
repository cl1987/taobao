(function($){
	//缓存数据
	var cache={
		data:{},
		count:0,
		addData:function(key,val){
			this.data[key]=val;
			this.count ++;
		},
		getData:function(key){
			return this.data[key];
		}
	}
	//运用面向对象的方法
	function Search($elem,options){//这是个构造函数
		// console.log(this)
		//1.罗列属性
		this.$elem=$elem;
		this.options=options;
		this.$searchInput=this.$elem.find('.search-input')
		this.$searchBtn=this.$elem.find('.search-btn')
		this.$searchLayer=this.$elem.find('.search-layer')
		this.$searchForm=this.$elem.find('.search-form')
		this.timer=0
		this.jqXHR=null
		//2.初始化
		this.init();
		// console.log(this.$layer)
		//3.判断是否显示下拉层
		if(this.options.autocomplete){//这个东西为什么不写在this.init()里面呢
			this.autocomplete()
		}
	}
	Search.prototype={//构造函数的原型对象
		constructor:Search,
		init:function(){
			//监听提交事件
			this.$searchBtn.on('click',$.proxy(this.submit,this))
		},
		submit:function(){
			//如果没有输入值则不提交
			if(!this.getInputValue()){
				return false;
			}
			this.$searchForm.trigger('submit');
		},
		getInputValue:function(){
			return $.trim(this.$searchInput.val())
		},
		autocomplete:function(){
			// console.log("111")
			//1.初始化显示隐藏插件
			this.$searchLayer.showHide(this.options)
			//2.监听输入框输入事件获取数据(用jsonp获取数据)
			if(this.options.delayGetData){
				this.$searchInput.on('input',function(){
					clearTimeout(this.timer);
					this.timer=setTimeout(function(){
						this.getData()
					}.bind(this),this.options.delayGetData)
				}.bind(this))
			}else{
				this.$searchInput.on('input',$.proxy(this.getData,this))
			}
			
			//3.点击别的地方让下拉选项消失
			$(document).on('click',function(){
				this.hideLayer()
			}.bind(this));
			//4.获取焦点让下拉层出现
			$(this.$searchInput).on('focus',function(ev){
				// //阻止事件冒泡
				// ev.stopPropagation()
				if(this.getInputValue()){
					this.showLayer()
				}
			}.bind(this))
			//5.点击输入框按钮阻止事件冒泡
			$(this.$searchInput).on('click',function(ev){
				ev.stopPropagation()
			})
			//6.(事件委托)完成点击下拉列表每一项提交数据
			var _this=this
			this.$elem.on('click','.search-item',function(){
				//1.获取点击项的内容
				//这里为什么用html？这个this不就是每一个li吗
				var val=$(this).html();
				//2.设置输入框的值
				_this.setInputVal(val);
				//3.提交相应的数据
				_this.submit()
			})
		},
		getData:function(){
			//获取数据
			//如果数据为空则不获取数据
			if(this.getInputValue==''){
				this.hideLayer()
				return;
			}
			//每一次发送请求前查看是否有缓存
			if (cache.getData(this.getInputValue())) {
				var cacheData=cache.getData(this.getInputValue())
				this.$elem.trigger('getData',cacheData);
				console.log('cacheData',11111)
				return;
			}
			//实时获取最新数据
			if(this.jqXHR){
				this.jqXHR.abort()
			}
			//发送ajax请求
			this.jqXHR=$.ajax({
				url:this.options.url+this.getInputValue(),//不明白这一步什么意思
				dataType:'jsonp',
				jsonp:'callback'
			})
			.done(function(data){//自带的done方法吗 data是哪里来的？
				console.log('001')
				/*
				//1 生成html结构
				var html='';
				for(var i=0;i<data.result.length;i++){
					html+='<li>'+data.result[i][0]+'</li>'
				}
				//2 将内容插入到下拉层中
				this.appendHTML(html)
				//3.显示下拉层
				if(html==''){
					this.hideLayer()
				}else{
					this.showLayer()
				}
				*/
				this.$elem.trigger('getData',data);
				//将获取的数据进行缓存
				cache.addData(this.getInputValue(),data)
			}.bind(this))
			.fail(function(err){
				this.$elem.trigger('getNoData');
			}.bind(this))
			.always(function(){
				this.jqXHR=null;
			}.bind(this))
		},
		appendHTML:function(html){
			this.$searchLayer.html(html);
		},
		showLayer:function(){
			this.$searchLayer.showHide('show');
		},
		hideLayer:function(){
			this.$searchLayer.showHide('hide');
		},
		setInputVal:function(val){
			this.$searchInput.val(val);
		}
	}
	//不传参数时的默认配制信息
	Search.DEFAULTS={
		autocomplete:true,
		url:'https://suggest.taobao.com/sug?q=',//不明白这一步什么意思,
		js:true,
		mode:'slide',
		delayGetData:300
	}
	//封装search插件
	$.fn.extend({
		search:function(options,val){
			//实现隐式迭代
			this.each(function(){
				// console.log(this)这里的this是每一个dom节点
				var $elem=$(this);
				// console.log("111111",$elem)
				var search=$elem.data('search')
				if(!search){
					options=$elem.extend({},Search.DEFAULTS,options);
					//通过search new出来的实例才可以调用search上面的一些方法
					search=new Search($elem,options);
					//将实例信息储存在dom节点上
					$elem.data('search',search)
				}
				//第二次调用search,则是调用实例上的方法
				if(typeof search[options]=='function' ){
					search[options](val);
				}
			})
		}
	})
})(jQuery)