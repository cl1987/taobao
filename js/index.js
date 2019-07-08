(function($){
	// 顶部导航逻辑开始
	var $dropdown = $('.dropdown');
	$dropdown.dropdown({
		js:true,
		mode:'fade'
	});
	$dropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
		console.log(ev.type);
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