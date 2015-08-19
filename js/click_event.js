function ClickCreateNodeTopic(genre){
	var $node = $("<div>").text(genre).addClass("topic");
	return $node;
}

function ClickNodesTopic(genres){
	var nodes = [];
	for (var i =0 ; i<genres.length;i++){
		var node = ClickCreateNodeTopic(genres[i].genre)
		nodes.push(node);
	}
	return nodes;
}

$(function(){
	topic_data = LoadTopicJson();
 	comic_data = LoadComicJson();
	$(document).on("click",".related_comic",function(){
		
		////////////////////////////////////////////
		//クリックしたコミックの中央への遷移、属性の変換
		////////////////////////////////////////////

		var clicked_comic_position = $(this).position();
		var clicked_comic_posX = clicked_comic_position.left;
		var clicked_comic_posY = clicked_comic_position.top;
		var center_position = $(".center").position();
		var center_posX = center_position.left;
		var center_posY = center_position.top;
		var distanceX = center_posX - clicked_comic_posX;
		var distanceY = center_posY - clicked_comic_posY;
		
		$(this).animate({
			left:"+=" + distanceX,
	         top:"+=" + distanceY 
	     },"slow");

		$(".center").removeClass(function(){
			$(this).remove();
		})
		$(".topic").remove();
		$(this).addClass("center",3000);
		$(this).removeClass("related_comic")
		$(".related_comic").not(this).remove();

		////////////////////////////////////////////
		//共起トピック、類似コミックの取得
		////////////////////////////////////////////


		var clicked_comic_data = [];//選択したコミックのタイトル／ジャンル情報
		var clicked_comic_title = $(this).text();

		for (var i = 0; i < comic_data.length; i++){
			if (clicked_comic_title.indexOf(comic_data[i].title) !== -1){
				clicked_comic_data.push(comic_data[i])
			}
		}
		related_topics = []
		for (var i = 0; i < topic_data.length; i++){
			var count = 0;
			for (var j = 0; j<clicked_comic_data[0].genres.length; j++){
				if($.inArray(clicked_comic_data[0].genres[j],topic_data[i].genre) !== -1){//str,list
					related_topics.push(topic_data[i])
					break;
				}
			}
		}
		console.log(related_topics)
		


		nodes_topics = ClickNodesTopic(related_topics);//関連topicのdiv
		
		var $topics = $("#topics");
	  	for (var i = 0; i < nodes_topics.length; i++){
	  		var $each_topics = nodes_topics[i];
	  		$topics.append($each_topics);	
	  		$each_topics.css({
	  			left:center_posX,
				top:center_posY,
	  		})
		}
		r = 256;
	  	spread_topics = SpreadTopics(nodes_topics,r,comic_data);
	  	spread_comics = SpreadComics(spread_topics[0],spread_topics[1]);
	})
})

