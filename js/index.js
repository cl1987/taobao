(function($){
	// 顶部导航逻辑开始
	var $topdropdown = $('.top .dropdown');
	$topdropdown.dropdown({
		js:true,
		mode:'fade'
	});

	//1.加载数据共同函数
	function loadHtmlOnce($elem,callback){
		var url=$elem.data('load')
		//如果没有地址，则无需加载数据
		if(!url) return; 
		//如果第一次进入则加载数据,后面再进入则不需要
		if(!$elem.data('isloaded')){
			$.getJSON(url,function(data){
				typeof callback=='function' && callback($elem,data)
			})
		}
	}
	//2.加载图片
	function loadImg(imgUrl,success,error){
		var image=new Image()
		image.onload=function(){
			typeof success == 'function' && success(imgUrl) 
		}
		image.onerror=function(){
			typeof error == 'function' && error(imgUrl) 
		}
		image.src=imgUrl
	}
	//加载数据
	$topdropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
		if(ev.type=='dropdown-show'){
			/*
			var url=$elem.data('load')
			// console.log(url);
			//如果没有地址，则无需加载数据
			if(!url) return; 
			//如果第一次进入则加载数据,后面再进入则不需要
			if(!$elem.data('isloaded')){
				$.getJSON(url,function(data){
					console.log(data)
					//生成HTML
					var html='';
					for(var i=0;i<data.length;i++){
						html+='<li><a href="'+data[i].url+'">'+data[i].name+'</a></li>'
					}
					
			})
			*/
			loadHtmlOnce($(this),buildTopLayer)
		}
	})
	//生成顶部下拉结构
	function buildTopLayer($elem,data){
		var $layer=$elem.find('.dropdown-layer');
		var html='';
		for(var i=0;i<data.length;i++){
			html+='<li><a href="'+data[i].url+'">'+data[i].name+'</a></li>'
		}
		//模拟加载数据
		setTimeout(function(){
			//将HTML插入到下拉层中
			$layer.html(html)
			//数据已经加载
			$elem.data('isloaded',true)
		},1000)	
	}
	
	
		// 原生js方法
	/*
		var $dropdown=$('.dropdown');
		$dropdown
		.hover(function(){
			// console.log($(this).data('active'));
			var activeClass=$(this).data('active')+"-active"
			$(this).addClass(activeClass);
		},function(){
			var activeClass=$(this).data('active')+'active'
			$(this).removeClass(activeClass);
		})
	*/
	// 顶部导航逻辑结束
	// $('button').on('click',function(){
	// 	$dropdown.dropdown('show')
	// })
//搜索区域开始..........................
	var $search=$('.search');
	//成功获取数据
	$search.on('getData',function(ev,data){
		// console.log(data)
		var $elem=$(this);
		var $layer=$elem.find('.search-layer')
		//1 生成html结构
		var html=createSearchLayer(data,10)
		//2 将内容插入到下拉层中
		$elem.search('appendHTML',html)
		//3.显示下拉层
		if(html==''){
			$elem.search('hideLayer');
		}else{
			$elem.search('showLayer');
		}
	})
	//生成html结构，并且控制条目
	function createSearchLayer(data,max){
		var html='';
		for(var i=0;i<data.result.length;i++){
			if(i>=max) break;
			html+='<li class="search-item">'+data.result[i][0]+'</li>'
		}
		return html
	}
	//失败的时候
	$search.on('getNoData',function(ev){
		var html='';
		$elem.search('hideLayer');
	})
	$search.search({})
///搜索区域结束...............................

///分类列表逻辑开始....................
	var $categorydropdown = $('.category .dropdown');
		$categorydropdown.dropdown({
			js:true,
			mode:'fade'
		});
	//加载数据
	$categorydropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
		if(ev.type=='dropdown-show'){
			loadHtmlOnce($(this),buildLeftLayer)
		}
	})
	//生成左拉列表
	function buildLeftLayer($elem,data){
		var $layer=$elem.find('.dropdown-layer');
		var html= '';
		for(var i=0;i<data.length;i++){
			html += '<dl class="category-details">'
			html +=	'	<dt class="category-details-title fl">'
			html +=	'		<a href="#" class="category-details-title-link">'+ data[i].title +'</a>'
			html +=	'	</dt>'
			html +=	'	<dd class="category-details-item fl">'
			for(var j = 0;j<data[i].items.length;j++){
				html +=	'<a href="#" class="link">'+data[i].items[j]+'</a>';
				// html +=	'<a href="#" class="link">'+data[i].items[j]+'</a>';
			}
			html +=	'	</dd>'
			html +=	'</dl>'		
		}				
		//模拟加载数据
		setTimeout(function(){
			//将HTML插入到下拉层中
			$layer.html(html) 
			console.log(111)
			//数据已经加载
			$elem.data('isloaded',true)
		},1000)	
	}
///分类列表逻辑结束....................

//轮播图逻辑开始.....................
	var $coursel = $('.carousel .carousel-wrap');
	var item={};
	var totalNum=$coursel.find('.carousel-img').length-1
	var totalLoadNum=0;
	var totalFn=0
	// 1.开始加载
	$coursel.on('coursel-show',totalFn=function(ev,index,elem){
		if(!item[index]){
			$coursel.trigger('coursel-load',index,elem)
			/*
				var $elem=$(elem);
				var $img=$elem.find('.carousel-img')
				var imgUrl=$img.data('src')
				loadImg(imgUrl,function(){
					$img.attr('src',imgUrl)
				},function(){
					$img.attr('src','images/focus-carousel/placeholder.png')
				})
				//图片已经被加载
				item[index]='isloaded'
				totalLoadNum++
				//所有图片都被加载则移除事件
				if(totalLoadNum>totalNum){
					$coursel.off('coursel-show',totalFn)
				}	
			*/
		}
	})
	// 2.执行加载
	$coursel.on('coursel-load',function(ev,index,elem){
		var $elem=$(elem);
		var $img=$elem.find('.carousel-img')
		var imgUrl=$img.data('src')
		loadImg(imgUrl,function(){
			$img.attr('src',imgUrl)
		},function(){
			$img.attr('src','images/focus-carousel/placeholder.png')
		})
		//图片已经被加载
		item[index]='isloaded'
		totalLoadNum++
		//所有图片都被加载则移除事件
		if(totalLoadNum>totalNum){
			$coursel.trigger('coursel-loaded')
		}
	})
	// 3.加载完毕
	$coursel.on('coursel-loaded',function(ev,index,elem){
		$coursel.off('coursel-show',totalFn)
	})

	
	$coursel.coursel({});
// 轮播图逻辑结束.....................
		

	
})(jQuery);