$(document).on("mouseover",".topic",function(){
	$(this).showBalloon({
		contents:"<div id = balloon>" + $(this).text() + "</div>"
	});
})

$(document).on("mouseout",".topic",function(){
	$(this).hideBalloon({
		contents:"<div id = balloon>" + $(this).text() + "</div>"
	});
})
