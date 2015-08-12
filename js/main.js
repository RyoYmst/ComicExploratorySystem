function CreateNodeTopic(genre){
	var $node = $("<div>").text(genre).addClass("topic");
	return $node;
}

function NodesTopic(genres){
	var nodes = [];
	for (var i = 0 ; i< genres.length ; i++){
		var node = CreateNodeTopic(genres[i]);
		nodes.push(node);
	}
	return nodes;
}

function RecommendComicGenres(title,comic_data){
	for (var i=0;i<comic_data.length;i++){
		db_title = " " + comic_data[i].title + " "
		if(db_title.indexOf(" " + title + " ") !== -1){
			return comic_data[i]
		}
	}
}

function spread(topics,r){
	for (var i=0;i<topics.length; i++){
	    var node = topics[i];
	    var centerX = node.offset().left;
	    var centerY = node.offset().top;

	    var rad = 2*Math.PI * (i/topics.length);
	    var x = r * Math.cos(rad) + centerX + 64/4;
	    var y = r * Math.sin(rad) + centerY + 91/4;
	    topics[i].animate({
	      left:x,
	      top:y
	    },"slow");
	}
}

$(function(){
 	topic_data = LoadTopicJson();
 	comic_data = LoadComicJson();

	$(document).on("click","#input_button",function(){
	  	var recommend_comic = ExpectLikeComic();
	  	var recommend_comic_gernes = RecommendComicGenres(recommend_comic[0],comic_data).genres;

	  	recommend_like_topics = []//共起する語が含まれるtopic
	  	for (var i =0 ; i< topic_data.length; i++){
	  		for (var j = 0; j< recommend_comic_gernes.length; j++){
	  			if ($.inArray(recommend_comic_gernes[j],topic_data[i].genre) !== -1){
	  				recommend_like_topics.push(topic_data[i].genre)
	  				break;
	  			}
	  		}
	  	}

		nodes_topics = NodesTopic(recommend_like_topics);//関連topicのdiv
		
	  	var $topics = $("#topics");
	  	var $expect_like_comic = $(".center");//中央に提示されるコミック
        var pos = $expect_like_comic.position();
        var centerX = pos.left;//中央のコミックのX座標
        var centerY = pos.top;//中央のコミックのY座標

	  	for (var i = 0; i< nodes_topics.length; i++){
	  		var $each_topics = nodes_topics[i];
	  		console.log($each_topics)
	  		$topics.append($each_topics);	
	  		$each_topics.css({
	  			left:centerX,
    			top:centerY,
	  		})
		}

	  	r = 100;
	  	spread(nodes_topics,r)
	  	$("#like_comic_titles").remove();
	});
})

$(document).on("mouseover",".topic",function(){
	console.log($(this).text());

})
