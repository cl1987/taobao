(function($){
	var $dropdown = $('.dropdown');
	$dropdown.dropdown({
		js:true,
		mode:'slide',
		eventName:'click'
	});
	$dropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
		console.log(ev.type);
	})
})(jQuery);