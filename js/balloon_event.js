$(document).on("mouseover",".topic",function(){
	$(this).showBalloon({
		contents:"<div id = balloon>" + $(this).text() + "</div>"
	});
})

$(document).on("mouseover",".related_comic",function(){
	console.log("test")
	// $(this).hideBalloon({
	// 	contents:"<div id = balloon>test</div>"
	// });
})

$(document).on("mouseout",".related_comic",function(){
	console.log("test")
	// $(this).hideBalloon({
	// 	contents:"<div id = balloon>test</div>"
	// });
})

$(document).on("mouseover",".related_comic",function(){
	$(this).showBalloon({
		contents:"<div id = balloon>" + $(this).text() + "</div>"
	});
})

