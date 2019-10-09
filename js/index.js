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
	//3.只加载一次数据
	function getDataOnce($elem,url,callback){
		var data=$elem.data('data');
		if(!data){
			$.getJSON(url,function(resData){
				callback(resData);
				$elem.data('data',resData)
			})
		}else{
			callback(data)
		}
	}
	//4.懒加载共通
	function lazyLoad(options){
		var item={},
			totalLoadNum=options.totalLoadNum,
			totalLoadedNum = 0,
			loadFn = null,
			totalNum = options.totalNum,
			$elem = options.$elem,
			eventName = options.eventName,
			eventPrifix = options.eventPrifix;
		// 1.开始加载
		$elem.on(eventName,loadFn=function(ev,index,elem){
			if(!item[index]){
				$elem.trigger(eventPrifix+'-load',[index,elem,function(){
					//图片已经被加载
					item[index] = 'isLoaded';
					totalLoadedNum++;
					//所有图片都被加载则移除事件
					if(totalLoadedNum > totalNum){
						$elem.trigger(eventPrifix+'-loaded');
					}
				}])	
			}
		})
		//3.加载完毕
		$elem.on(eventPrifix+'-loaded',function(){
			$elem.off(eventName,loadFn);
		})
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


//轮播图懒加载共通开始.....................
/*
	function courselLazyLoad($elem){
		var item={};
		var totalNum=$elem.find('.carousel-img').length-1
		var totalLoadNum=0;
		var totalFn=0
		// 1.开始加载
		$elem.on('coursel-show',totalFn=function(ev,index,elem){
			if(!item[index]){
				$elem.trigger('coursel-load',[index,elem])	
			}
		})
		// 2.执行加载
		$elem.on('coursel-load',function(ev,index,elem){
			var $elem=$(elem);
			var $imgs=$elem.find('.carousel-img')
			$imgs.each(function(){
				var $img = $(this);
				var imgUrl=$img.data('src')
				loadImg(imgUrl,function(){
					$img.attr('src',imgUrl)
				},function(){
					$img.attr('src','images/focus-carousel/placeholder.png')
				})
			})
			//图片已经被加载
			item[index]='isloaded'
			totalLoadNum++
			//所有图片都被加载则移除事件
			if(totalLoadNum>totalNum){
				$elem.trigger('coursel-loaded')
			}
		})
		// 3.加载完毕
		$elem.on('coursel-loaded',function(){
			$elem.off('coursel-show',totalFn)
		})	
	}	

*/

//轮播图懒加载共通结束.....................



//轮播图逻辑开始.....................
	var $coursel = $('.carousel .carousel-wrap');
	/*
		$coursel.item={};
		$coursel.totalNum=$coursel.find('.carousel-img').length-1
		$coursel.totalLoadNum=0;
		$coursel.totalFn=0
		// 1.开始加载
		$coursel.on('coursel-show',$coursel.totalFn=function(ev,index,elem){
			if(!$coursel.item[index]){
				$coursel.trigger('coursel-load',[index,elem])	
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
			$coursel.item[index]='isloaded'
			$coursel.totalLoadNum++
			//所有图片都被加载则移除事件
			if($coursel.totalLoadNum>$coursel.totalNum){
				$coursel.trigger('coursel-loaded')
			}
		})
		// 3.加载完毕
		$coursel.on('coursel-loaded',function(){
			$coursel.off('coursel-show',$coursel.totalFn)
		})
	*/
	// courselLazyLoad($coursel)
	lazyLoad({
		totalNum:$coursel.find('.carousel-img').length - 1,
		$elem:$coursel,
		eventName:'coursel-show',
		eventPrifix:'coursel'
	})
	//2.执行加载
	$coursel.on('coursel-load',function(ev,index,elem,success){
		// console.log('will load img',index);
		var $elem = $(elem);
		var $imgs = $elem.find('.carousel-img');
		$imgs.each(function(){
			var $img = $(this);
			var imgUrl = $img.data('src');
			loadImg(imgUrl,function(){
				$img.attr('src',imgUrl);
			},function(){
				$img.attr('src','images/focus-carousel/placeholder.png');
			});
			//加载完成后执行函数
			success();
		})
	})
	$coursel.coursel({});
// 轮播图逻辑结束.....................

//今日热销开始
	var $todaysCoursel = $('.todays .carousel .carousel-wrap');
	/*
		$todaysCoursel.item={};
		$todaysCoursel.totalNum=$todaysCoursel.find('.carousel-img').length-1
		$todaysCoursel.totalLoadNum=0;
		$todaysCoursel.totalFn=0
		// 1.开始加载
		$todaysCoursel.on('coursel-show',$todaysCoursel.totalFn=function(ev,index,elem){
			if(!$todaysCoursel.item[index]){
				$todaysCoursel.trigger('coursel-load',[index,elem])	
			}
		})
		// 2.执行加载
		$todaysCoursel.on('coursel-load',function(ev,index,elem){
			var $elem=$(elem);
			var $imgs=$elem.find('.carousel-img')
			$imgs.each(function(){
				var imgUrl=$img.data('src')
				loadImg(imgUrl,function(){
					$img.attr('src',imgUrl)
				},function(){
					$img.attr('src','images/focus-carousel/placeholder.png')
				})
			})
			//图片已经被加载
			$todaysCoursel.item[index]='isloaded'
			$todaysCoursel.totalLoadNum++
			//所有图片都被加载则移除事件
			if($todaysCoursel.totalLoadNum>$todaysCoursel.totalNum){
				$todaysCoursel.trigger('coursel-loaded')
			}
		})
		// 3.加载完毕
		$todaysCoursel.on('coursel-loaded',function(){
			$todaysCoursel.off('coursel-show',$todaysCoursel.totalFn)
		})
	*/
	// courselLazyLoad($todaysCoursel)
	lazyLoad({
		totalNum:$todaysCoursel.find('.carousel-img').length - 1,
		$elem:$todaysCoursel,
		eventName:'coursel-show',
		eventPrifix:'coursel'
	})
	//2.执行加载
	$todaysCoursel.on('coursel-load',function(ev,index,elem,success){
		// console.log('will load img',index);
		var $elem = $(elem);
		var $imgs = $elem.find('.carousel-img');
		$imgs.each(function(){
			var $img = $(this);
			var imgUrl = $img.data('src');
			loadImg(imgUrl,function(){
				$img.attr('src',imgUrl);
			},function(){
				$img.attr('src','images/focus-carousel/placeholder.png');
			});
			//加载完成后执行函数
			success();
		})
	})
	$todaysCoursel.coursel({});
//今日热销结束............

//楼层逻辑开始............
//楼层图片懒加载
/*
function floorImgLazyLoad($elem){
	var item={};
	var totalNum=$elem.find('.floor-img').length-1
	var totalLoadNum=0;
	var totalFn=0
	// 1.开始加载
	$elem.on('tab-show',totalFn=function(ev,index,elem){
		if(!item[index]){
			$elem.trigger('tab-load',[index,elem])	
		}
	})
	// 2.执行加载
	$elem.on('tab-load',function(ev,index,elem){
		var $elem=$(elem);
		var $imgs=$elem.find('.floor-img')
		$imgs.each(function(){
			var $img = $(this);
			var imgUrl=$img.data('src')
			loadImg(imgUrl,function(){
				$img.attr('src',imgUrl)
			},function(){
				$img.attr('src','images/focus-carousel/placeholder.png')
			})
		})
		//图片已经被加载
		item[index]='isloaded'
		totalLoadNum++
		//所有图片都被加载则移除事件
		if(totalLoadNum>totalNum){
			$elem.trigger('tab-loaded')
		}
	})
	// 3.加载完毕
	$elem.on('tab-loaded',function(){
		$elem.off('tab-show',totalFn)
	})	
}
*/
//生成楼层html
function buildFloorHtml(oneFloorData){
	var html=''
	html+='<div class="container">';
	html+=buildFloorHeaderHtml(oneFloorData);
	html+=buildFloorBodyHtml(oneFloorData);
	html+='</div>';
	return html
}
function buildFloorHeaderHtml(oneFloorData){
	var html=''
	html+=  '<div class="floor-hd">';
	html+=	'	<h2 class="floor-title fl">';
	html+=	'		<span class="floor-title-num">'+oneFloorData.num+'F</span>';
	html+=	'		<span class="floor-title-text">'+oneFloorData.text+'</span>';
	html+=	'	</h2>';
	html+=	'	<ul class="tab-item-wrap fr">';
	for(var i=0; i<oneFloorData.tabs.length;i++){
		html+=	'	<li class="fl">';
		html+=	'		<a class="tab-item" href="javascript:;">'+oneFloorData.tabs[i]+'</a>';
		html+=	'	</li>';
		if(i != oneFloorData.tabs.length-1){
			html+=	'<li class="fl tab-divider"></li>';
		}
	}
	html+=	'	</ul>';
	html+=	'</div>';
	return html
}
function buildFloorBodyHtml(oneFloorData){
		var html = '';
		html += '<div class="floor-bd">';
		for(var i = 0;i<oneFloorData.items.length;i++){
			html +=	'	<ul class="tab-panel clearfix">';
			for(var j = 0;j<oneFloorData.items[i].length;j++){
				html +=	'		<li class="floor-item fl">';
				html +=	'			<p class="floor-item-pic">';
				html +=	'				<a href="#">';
				html +=	'					<img class="floor-img" src="images/floor/loading.gif" data-src="images/floor/'+oneFloorData.num+'/'+(i+1)+'/'+(j+1)+'.png" alt="">';
				html +=	'				</a>';
				html +=	'			</p>';
				html +=	'			<p class="floor-item-name">';
				html +=	'				<a class="link" href="#">'+oneFloorData.items[i][j].name+'</a>';
				html +=	'			</p>';
				html +=	'			<p class="floor-item-price">￥'+oneFloorData.items[i][j].price+' </p>';
				html +=	'		</li>';
			}
			html +=	'	</ul>';
		}
		html +=	'</div>';
		return html;
}
//楼层html懒加载
/*
function floorHtmlLazyLoad(){
	var item={};
	var totalNum=$floor.length-1
	var totalLoadNum=0;
	var totalFn=0
	// 1.开始加载
	$doc.on('floor-show',totalFn=function(ev,index,elem){
		if(!item[index]){
			$doc.trigger('floor-load',[index,elem])	
		}
	})
	// 2.执行加载
	$doc.on('floor-load',function(ev,index,elem){
		getDataOnce($doc,'data/floor/floorData.json',function(data){
			// console.log(data[index])
			//1生成html结构
			var html=buildFloorHtml(data[index]);
			//2加载html结构
			$(elem).html(html);
			//3楼层图片懒加载
			floorImgLazyLoad($(elem));
			//4.激活选项卡
			$(elem).tab({});
		})
		//图片已经被加载
		item[index]='isloaded'
		totalLoadNum++
		//所有图片都被加载则移除事件
		if(totalLoadNum>totalNum){
			$doc.trigger('floor-loaded')
		}
	})
	// 3.加载完毕
	$doc.on('floor-loaded',function(){
		$doc.off('floor-show',totalFn)
	})	
}
*/

//判断是否在可视区
function isVisible($elem){
	return ($win.height() + $win.scrollTop() > $elem.offset().top) && ($elem.offset().top + $elem.height() > $win.scrollTop())
}
	
// $win.scrollTop()+$win.height()>$elem.offset().top && $elem.height+$elem.offset().top>$win.scrollTop()
//return ($win.height() + $win.scrollTop() > $elem.offset().top) && ($elem.offset().top + $elem.height() > $win.scrollTop())
	var $floor=$('.floor');
	var $win=$(window)
	var $doc=$(document)
	//楼层图片懒加载2.执行加载
	$floor.on('tab-load',function(ev,index,elem,success){
		// console.log('will load img',index);
		var $elem = $(elem);
		var $imgs = $elem.find('.floor-img');
		$imgs.each(function(){
			var $img = $(this);
			var imgUrl = $img.data('src');
			loadImg(imgUrl,function(){
				$img.attr('src',imgUrl);
			},function(){
				$img.attr('src','images/focus-carousel/placeholder.png');
			});
		})
	})
	//楼层html结构懒加载
	lazyLoad({
		totalNum:$floor.length - 1,
		$elem:$doc,
		eventName:'floor-show',
		eventPrifix:'floor'
	})
	//楼层html懒加载:2.执行加载
	$doc.on('floor-load',function(ev,index,elem,success){
		// console.log('will floor show',index);
		//1.生成html结构
		getDataOnce($doc,'data/floor/floorData.json',function(data){
			// console.log(data[index]);
			var html = buildFloorHtml(data[index]);
			//2.加载html
			$(elem).html(html);			
			//3.楼层图片懒加载
			// floorImgLazyLoad($(elem));
			lazyLoad({
				totalNum:$(elem).find('.carousel-img').length - 1,
				$elem:$(elem),
				eventName:'tab-show',
				eventPrifix:'tab'
			})
			//4.激活选项卡
			$(elem).tab({});			
		});
		//加载成功执行函数
		success();
		console.log(111)
	})
	// floorHtmlLazyLoad();
	//遍历每一个楼层实现图片懒加载
	/*
		$floor.each(function(){
			floorImgLazyLoad($(this));
		})
	*/
	$doc.on('floor-show',function(ev,index,$elem){
		console.log(index,$elem)
	})
	function timeToShow(){
		$floor.each(function(index,elem){
			if(isVisible($(elem))){//这里为什么不是$elem呢？还要加括号
				$doc.trigger('floor-show',[index,elem])
			}
		})
	}
	$win.on('load scroll resize',function(){
		clearTimeout($floor.showTimer)
		$floor.showTimer=setTimeout(timeToShow,200)//这里的timeToShow怎么不带括号
	})
	// $floor.tab({});
//楼层逻辑结束............
/*电梯逻辑开始*/
	var $elevator = $('.elevator');
	var $elevatorItems = $('.elevator-item');

	//获取楼层号
	function getFloorNum(){
		var num = -1;
		$floor.each(function(index,elem){
			num = index;
			if($(elem).offset().top > $win.height()/2 + $win.scrollTop()){
				num = index - 1;
				return false;
			}
		})
		return num;
	}
	//设置电梯号
	function setElevator(){
		var num = getFloorNum();
		if(num == -1){
			$elevator.fadeOut();
		}else{
			$elevator.fadeIn();
			//清除所有选中的
			$elevatorItems.removeClass('elevator-active');
			//选中对应的电梯号
			$elevatorItems.eq(num).addClass('elevator-active');
		}
	}
	$win.on('load scroll resize',function(){
		clearTimeout($elevator.showElevatorTimer);
		$elevator.showElevatorTimer = setTimeout(setElevator,200);
	})
	//监听点击电梯事件回到对应楼层
	$elevator.on('click','.elevator-item',function(){
		var index = $elevatorItems.index(this);
		$('html,body').animate({
			scrollTop:$floor.eq(index).offset().top
		});
	})
	/*电梯逻辑结束*/

	/*工具条逻辑开始*/
	var $backToTop = $('#backToTop');
	$backToTop.on('click',function(){
		$('html,body').animate({
			scrollTop:0
		});
	})
	/*工具条逻辑结束*/
})(jQuery);