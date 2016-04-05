(function(){Template.loadingTemplate.rendered = function(){
	$(".loader").each(function(k, elem){
		$(elem).css({
			position : "absolute",
			left : ($(window).width() / 2) - ($(elem).width() / 2),
			top : ($(window).height() / 2) - ($(elem).height() / 2)
		}) ;
	});
}	
}).call(this);
