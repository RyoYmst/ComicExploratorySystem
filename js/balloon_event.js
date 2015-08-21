
$(document).on("mouseover",".topic",function(){

	$(this).showBalloon({
		contents:"<div id = balloon>" + $(this).text() + "</div>"
	});
})

$(document).on("mouseout",".topic",function(){
	$(this).hideBalloon();
})


$(document).on("mouseover",".related_comic",function(){
	$(this).showBalloon({
		contents:"<div id = balloon>"+ $(this).text() +"</div>"
	});
})

$(document).on("mouseout",".related_comic",function(){
	$(this).hideBalloon();
})

$(document).on("click",".topic",function(){
	console.log($(this).text())
})


$(document).on("mouseover",".center",function(){
	match_data = [];
	for (var i = 0; i < comic_data.length; i++){
		if ($(this).text().indexOf(comic_data[i].title) !== -1){
			match_data.push(comic_data[i])
			break
		}
	}
	$(this).showBalloon({
		contents:"<div id = balloon>" + "<div id = balloon_title>" + match_data[0].title+ "</div>" + "<br>" + match_data[0].genres + "</div>",
		css:{
			backgroundColor:"#F8DC85",
		}
	});
})

$(document).on("mouseout",".center",function(){
	$(this).hideBalloon();
})









