function CreateNodeTopic(genre){
	var $node = $("<div>").text(genre).addClass("topics");
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
		 console.log(topics[i])
	    // var node = topics[i];
	    // var centerX = node.offset().left;
	    // var centerY = node.offset().top;
	    // var rad = 2*Math.PI * (i/topics.length);
	    // var x = r * Math.cos(rad) + centerX;
	    // var y = r * Math.sin(rad) + centerY;
	    // topics[i].animate({
	    //   left:x,
	    //   top:y },"slow");
	    }
}

$(function(){
 	topic_data = LoadTopicJson();
 	comic_data = LoadComicJson();

	$(document).on("click","#input_button",function(){
	  	var recommend_comic = ExpectLikeComic();
	  	var recommend_comic_gernes = RecommendComicGenres(recommend_comic[0],comic_data).genres;
	  	var $genre = $("#genres");
	  	nodes_genre = NodesTopic(recommend_comic_gernes);
	  	for (var i = 0; i< nodes_genre.length; i++){
	  		var each_genre = nodes_genre[i];
	  		$genre.append(each_genre);
	  	}

	  	recommend_like_topics = []
	  	for (var i =0 ; i< topic_data.length; i++){
	  		var count = 0;
	  		for (var j = 0; j< recommend_comic_gernes.length; j++){
	  			if ($.inArray(recommend_comic_gernes[j],topic_data[i].genre) !== -1){
	  				recommend_like_topics.push(topic_data[i].genre)
	  				break;
	  			}
	  		}
	  	}

	  	var $topics = $("#topics");
	  	var $expect_like_comic = $(".center");//中央に提示されるコミック
        var pos = $expect_like_comic.position();
        console.log(pos);
        var centerX = pos.left;
        var centerY = pos.top;
	  	for (var i = 0; i< recommend_like_topics.length; i++){
	  		var each_topics = "hoge";//recommend_like_topics[i];
	  		// $topics.append(each_topics);
	  	
	  	}
	  	r = 200;
	  	spread(recommend_like_topics,r)
	  	


	  	$("#like_comic_titles").remove();


	});
})