(function($){
	// 顶部导航逻辑开始
	var $dropdown = $('.dropdown');
	$dropdown.dropdown({
		js:true,
		mode:'fade'
	});
	$dropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
		if(ev.type=='dropdown-show'){
			var $elem=$(this);
			var $layer=$elem.find('.dropdown-layer');
			var url=$elem.data('load')
			//如果没有地址，则无需加载数据
			if(!url) return; 
			$.getJSON(url,function(data){
				//生成HTML
				var html='';
				for(var i=0;i<data.length;i++){
					html+='<li><a href="'+data[i].url+'">'+data[i].name+'</a></li>'
				}
				//将HTML插入到下拉层中
				$layer.html(html)
			})
		}
	})
	
	
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
	$('button').on('click',function(){
		$dropdown.dropdown('show')
	})
})(jQuery);