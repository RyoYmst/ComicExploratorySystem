function SplitWords(topic_word_list){//トピックを表示する際の単語間の間隔調整
	split_topic_word_list = [];
	for(var i = 0; i < topic_word_list.length; i++){
		split_topic_word_list.push(" " + topic_word_list[i] + " ")
	}
	return split_topic_word_list
}

////////////////////////////////////////////
//各トピックのマウスイベント処理(バルーン)
////////////////////////////////////////////

$("#topics").on("mouseover",".topic",function(){
	var split_topic_word = SplitWords($(this).text().split(","))
	$(this).showBalloon({
		contents:"<div id = balloon_tipic>" + split_topic_word_list + "</div>",
		css:{
			fontSize:"24px",
			width:"500px",
			backgroundColor:"#CCFFFF"//青系当
		}
	});
})

$(document).on("mouseout",".topic",function(){
	$(this).hideBalloon();
})

////////////////////////////////////////////
//関連コミックのマウスイベント処理(バルーン)
////////////////////////////////////////////

$(document).on("mouseover",".related_comic",function(){
	match_data = [];
	for (var i = 0; i < comic_data.length; i++){
		if ($(this).text().indexOf(comic_data[i].title) !== -1){
			match_data.push(comic_data[i])
			break
		}
	} 
	var split_topic_word = SplitWords(match_data[0].genres)
	$(this).css({
			position:"absolute",
			zIndex:"2"
	})
	$(".related_comic").not(this).css({
		position:"absolute",
		zIndex:"1"
	})

	$(this).showBalloon({
		contents:"<div id = balloon_related><div id = balloon_title>" + match_data[0].title + "</div><br>" + split_topic_word + "</div>",
		css:{
			width:"500px",
			backgroundColor:"#FFCCFF"	
		}
	});
	$(this).animate({
		width:"153.6px",
		height:"218.4px"
	},"500");
})

$(document).on("mouseout",".related_comic",function(){
	$(this).hideBalloon();
	$(this).animate({
		width:"38.4px",
		height:"54.6px"
	},"500");
})

////////////////////////////////////////////
//中央提示コミックのイベント処理(バルーン)
////////////////////////////////////////////

$(document).on("mouseover",".center",function(){
	console.log($(this).text())
	match_data = [];
	for (var i = 0; i < comic_data.length; i++){
		if ($(this).text().indexOf(comic_data[i].title) !== -1){
			match_data.push(comic_data[i])
			break
		}
	}
	var split_topic_word = SplitWords(match_data[0].genres)
	$(this).showBalloon({
		contents:"<div id = balloon_center><div id = balloon_title>" + match_data[0].title+ "</div><br>" + split_topic_word + "</div>",
		css:{
			width:"500px",
			backgroundColor:"#F8DC85",
			fontColor:"black",
		}
	});
	$(this).css({
			position:"absolute",
			zIndex:"100"

	})
	$(this).animate({
		width:"153.6px",
		height:"218.4px"
	},"500");

})


$(document).on("mouseout",".center",function(){
	$(this).hideBalloon();
	$(this).animate({
		width:"64px",
		height:"91px"
	},"500");

})

////////////////////////////////////////////
//選択履歴部分のイベント処理(バルーン)
////////////////////////////////////////////

$(document).on("mouseover",".histories",function(){
			match_data = [];
	for (var i = 0; i < comic_data.length; i++){
		if ($(this).text().indexOf(comic_data[i].title) !== -1){
			match_data.push(comic_data[i])
			break
		}
	}
	var split_topic_word = SplitWords(match_data[0].genres)
	$(this).showBalloon({
		contents:"<div id = balloon_center><div id = balloon_title>" + match_data[0].title+ "</div><br>" + split_topic_word + "</div>",
		css:{
			width:"500px",
			backgroundColor:"#F8DC85",
			fontColor:"black"
		}
	});	
})

$(document).on("mouseout",".histories",function(){
	$(this).hideBalloon();
})