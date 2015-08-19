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

function CreateTopicArea(genre){
	var $node = $("<div>").addClass("topic_area");
	return $node;
}

function TopicArea(genres){
	var nodes = [];
	for (var i = 0 ; i< genres.length ; i++){
		var node = CreateTopicArea(genres[i]);
		nodes.push(node);
	}
	return nodes;
}


function RecommendComicGenres(title,comic_data){
	for (var i=0;i < comic_data.length;i++){
		db_title = " " + comic_data[i].title + " "
		if(db_title.indexOf(" " + title + " ") !== -1){
			return comic_data[i]
		}
	}
}

function CreateNodeComic(related_comic){
	var $node = $("<div>").text(related_comic.title).addClass("related_comic");
	return $node
}

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
	var non_related_comic_topic = [];
	var topic_contents_list = topic.text().split(',');
	for(var i=0; i <comic_data.length; i++){
		var related_comic = {};
		var count = 0;
		var common_words = [];//各作品の特徴とトピックの語との共起語のlist

		for(j=0; j <topic_contents_list.length; j++){
			if ($.inArray(topic_contents_list[j],comic_data[i].genres) !== -1){//topic内の各単語と対象作品の特徴語とを比較(str,list)
				if (comic_data[i].title.indexOf($(".center").text()) == -1){
					if (count > 1){
						related_comic["title"] = comic_data[i].title;
						related_comic["genres"] = comic_data[i].genres;	
					}else{
						count = count + 1 ;
					}
					common_words.push(topic_contents_list[j])
				}
			}
		}

		if (Object.keys(common_words).length > 2){
			related_comic["common_words"] = common_words;
		}
		if (Object.keys(related_comic).length !== 0){
			related_comics.push(related_comic)
		}
	}

	if (related_comics.length == 0){
		non_related_comic_topic.push(1)
	}else{
		non_related_comic_topic.push(0)
	}

	draw_related_comics = DrawRelatedComics(related_comics)
	
	return [draw_related_comics,related_comics,non_related_comic_topic]
}

////////////////////////////////////////////
//類似コミックの描画
////////////////////////////////////////////
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
			"background-image":"url(../~artuhr0912/img/" + related_comics[i].text() + ".jpg)"
		})
	}
}

function SpreadTopics(topics,r,comic_data){//トピックの位置情報、類似コミック、類似コミックの情報
	var location = [];
	var related_comcis_list = [];
	for (var i = 0; i < topics.length; i++){
		var node = topics[i]
		related_comics = RelatedComics(topics[i],comic_data)
	    var centerX = node.offset().left;
	    var centerY = node.offset().top;
	    var rad = 2 * Math.PI * (i/topics.length);//1~n番目
	    var x = r * Math.cos(rad) + centerX + 64/3;
	    var y = r * Math.sin(rad) + centerY + 91/4;
	    location.push([x,y])

	    DrawComics(related_comics[0],x,y)
		related_comcis_list.push(related_comics[0])
	    topics[i].animate({
	      left:x,
	      top:y
	    },"slow");

	}
	return [location,related_comcis_list,related_comics[1]]
}

function SpreadTopicsArea(topics,r){//トピックの位置情報、類似コミック、類似コミックの情報
	// var location = [];
	// var related_comcis_list = [];
	for (var i = 0; i < topics.length; i++){
		var node = topics[i]
	    var centerX = node.offset().left;
	    var centerY = node.offset().top;
	    var rad = 2 * Math.PI * (i/topics.length);//1~n番目
	    var x = r * Math.cos(rad) + centerX + 64/3;
	    var y = r * Math.sin(rad) + centerY + 91/4;
	    // location.push([x,y])

	    // DrawComics(related_comics[0],x,y)
		// related_comcis_list.push(related_comics[0])
	    topics[i].animate({
	      left:x,
	      top:y
	    },"slow");

	}
}

function SpreadComics(location_list,related_comics){
	var r = 72;
	for (var i = 0; i< related_comics.length; i++){
		for (var j = 0; j< location_list.length; j++){
			if (i == j){//enumerate
				var centerX = location_list[j][0] - 64/4;
				var centerY = location_list[j][1] - 91/4;

				for (var t = 0; t< related_comics[i].length;t++){
					var rad = 2 * Math.PI * (t/related_comics[i].length);//各トピックに類似するコミックの数だけラジアンを計算
					var x = r * Math.cos(rad) + centerX;
				    var y = r * Math.sin(rad) + centerY;
				    related_comics[i][t].animate({
				    		left:x,
				    		top:y
				    	},"slow")
				}
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
		nodes_topics_area = TopicArea(recommend_like_topics);

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
    			zIndex:"1",
	  		})
		}

		var $topics_area = $("#topic_area");
		for (var i = 0; i < nodes_topics_area.length; i++){
	  		var $hoge = nodes_topics_area[i];
	  		$topics_area.append($hoge);	
	  		$hoge.css({
	  			left:centerX-100,
    			top:centerY-100,
    			zIndex:"-1",
	  		})
		}

	  	r = 256;
	  	spread_topics = SpreadTopics(nodes_topics,r,comic_data);
	  	spread_topics_area = SpreadTopicsArea(nodes_topics_area,r)
	  	spread_comics = SpreadComics(spread_topics[0],spread_topics[1]);
	  	$("#like_comic_titles").remove();
	});
})


