function DrawRelatedComics(related_comics){
	var nodes = [];
	for (i = 0; i<related_comics.length; i++){
		var node = CreateNodeComic(related_comics[i])
			nodes.push(node);
	}
	return nodes;
}

function RelatedComics(topic,comic_data){

	var related_comics = [];
	var topic_contents_list = topic.text().split(',');
	for(var i=0; i <comic_data.length; i++){
		var related_comic = {};
		var count = 0;
		var common_words = [];//各作品の特徴とトピックの語との共起語のlist

		for(j=0; j <topic_contents_list.length; j++){
			if ($.inArray(topic_contents_list[j],comic_data[i].genres) !== -1){//topic内の各単語と対象作品の特徴語とを比較
				if (count > 1){
					related_comic["title"] = comic_data[i].title;
					related_comic["genres"] = comic_data[i].genres;	
				}else{
					count = count + 1 ;
				}
				common_words.push(topic_contents_list[j])
			}
		}

		if (Object.keys(common_words).length > 2){
			related_comic["common_words"] = common_words;
		}
		if (Object.keys(related_comic).length !== 0){
			related_comics.push(related_comic)
		}
	}
	draw_related_comics = DrawRelatedComics(related_comics)
	return draw_related_comics
}


function DrawComics(related_comics,x,y){
	var $comics = $("#related_comics");
	var centerX = x;
	var centerY = y;
	
	for(var i =0;i<related_comics.length;i++){
		var $each_comics = related_comics[i];
		$comics.append($each_comics);
		$each_comics.css({
			left:x,
			top:y,
		})
	}
}

function SpreadTopics(topics,r,comic_data){
	var location = [];
	var related_comcis_list = [];
	for (var i = 0; i < topics.length; i++){
	    var node = topics[i];
	    var centerX = node.offset().left;
	    var centerY = node.offset().top;
	    var rad = 2 * Math.PI * (i/topics.length);//1~n番目
	    // console.log(rad)
	    var x = r * Math.cos(rad) + centerX + 64/4;
	    var y = r * Math.sin(rad) + centerY + 91/4;
	    location.push([x,y])

	    related_comics = RelatedComics(topics[i],comic_data)
	    DrawComics(related_comics,x,y)
	    // break
		related_comcis_list.push(related_comics)
	    topics[i].animate({
	      left:x,
	      top:y
	    },"slow");
	}
	return [location,related_comcis_list]
}

function SpreadComics(location_list,related_comics){
	var r = 50;
	for (var i = 0; i< related_comics.length; i++){
		for (var j = 0; j< location_list.length; j++){
			if (i == j){//enumerate
				console.log(related_comics[i].length)
				var centerX = location_list[j][0];
				var centerY = location_list[j][1];
				// console.log(centerX,centerY)
				
				for (var t = 0; t< related_comics[i].length;t++){
					var rad = 2 * Math.PI * (t/related_comics[i].length);//各トピックに類似するコミックの数だけラジアンを計算
					// console.log(related_comics[i].length)
				
					var x = r * Math.cos(rad) + centerX;
				    var y = r * Math.sin(rad) + centerY;


				    	related_comics[i][t].animate({
				    		left:x,
				    		top:y
				    	},"slow");
				    	}
			}else{
				continue
			}

			}

		}
	}


$(function(){
 	topic_data = LoadTopicJson();
 	comic_data = LoadComicJson();

	$(document).on("click","#input_button",function(){
	  	var recommend_comic = ExpectLikeComic();
	  	var recommend_comic_gernes = RecommendComicGenres(recommend_comic[0],comic_data).genres;

	  	recommend_like_topics = []//共起する語が含まれるtopic
	  	for (var i = 0 ; i < topic_data.length; i++){
	  		for (var j = 0; j < recommend_comic_gernes.length; j++){
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

	  	for (var i = 0; i < nodes_topics.length; i++){
	  		var $each_topics = nodes_topics[i];
	  		$topics.append($each_topics);	
	  		$each_topics.css({
	  			left:centerX,
    			top:centerY,
	  		})
		}

	  	r = 200;
	  	spread_topics = SpreadTopics(nodes_topics,r,comic_data)
	  	spread_comics = SpreadComics(spread_topics[0],spread_topics[1])
	  	$("#like_comic_titles").remove();
	});
})


