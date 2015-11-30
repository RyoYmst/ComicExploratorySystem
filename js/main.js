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

function CreateNodeComic(related_comic){
	var $node = $("<div>").text(related_comic.title).addClass("related_comic");
	return $node
}

function DrawRelatedComics(related_comics){
 	selected_comics = Selected(related_comics.length,9)
	var nodes = [];
	for (i = 0; i< selected_comics.length; i++){
		console.log(related_comics[i])
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
					if (count > 2){                                                                               //共起数判定
						related_comic["title"] = comic_data[i].title;
						related_comic["genres"] = comic_data[i].genres;	
					}else{
						count = count + 1 ;
					}
					common_words.push(topic_contents_list[j])
				}
			}
		}

		// if (Object.keys(common_words).length > 2){
		// 	related_comic["common_words"] = common_words;
		// }
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
			//"background-color":"blue"
			"background-image":"url(../~artuhr0912/image/" + related_comics[i].text() + ".jpg)"
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
	    var x = r * Math.cos(rad) + centerX + 64/4;
	    var y = r * Math.sin(rad) + centerY + 91/4;
	    location.push([x,y])

	    DrawComics(related_comics[0],x,y)
		related_comcis_list.push(related_comics[0])
	    topics[i].animate({
	      left:x-5,//各トピックのx座標
	      top:y-5//各トピックのy座標
	    },"slow");

	}
	return [location,related_comcis_list,related_comics[1]]
}

function SpreadTopicsArea(topics,r){//トピックの位置情報、類似コミック、類似コミックの情報
	for (var i = 0; i < topics.length; i++){
		var node = topics[i]
	    var centerX = node.offset().left;
	    var centerY = node.offset().top;
	    var rad = 2 * Math.PI * (i/topics.length);//1~n番目
	    var x = r * Math.cos(rad) + centerX + 20;//違う
	    var y = r * Math.sin(rad) + centerY + 25;//違う
	    topics[i].css({
	      left:x,
	      top:y
	    },"slow");

	}
}

function SpreadComics(location_list,related_comics){
	var r = 100;
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

function DrawFunction(nodes_topics){
	var $topics = $("#topics");
  	for (var i = 0; i < nodes_topics.length; i++){
  		var $each_topics = nodes_topics[i];
  		$topics.append($each_topics);	
  		$each_topics.css({
  			left:window_center_posX,
			top:window_center_posY,
			zIndex:"1",
  		})
	}

	var $topics_area = $("#topic_area");
	for (var i = 0; i < nodes_topics_area.length; i++){
  		var $hoge = nodes_topics_area[i];
  		$topics_area.append($hoge);	
  		$hoge.css({
  			left:window_center_posX-100,
			top:window_center_posY-100,
			zIndex:"-1",
  		})
	}
}

function Selected(num,max){
	selected_num = [];
	for (var i = 0; i < num; i++){
    	var candidate = Math.floor(Math.random()*num);
    	L: if ($.inArray(candidate,selected_num) == -1){
      		if (selected_num.length < max){
      			selected_num.push(candidate);
      		}else{
      			break L
      		}
      	}else{
      		i = i - 1;
		}
	}

	return selected_num
}


var window_center_posX = $(window).width()/2;
var window_center_posY = $(window).height()/2;

$(function(){
	////////////////////////////////////////////
	//topicのデータと作品のデータ読み込み
	////////////////////////////////////////////
 	topic_data = LoadTopicJson();
 	comic_data = LoadComicJson();

	$(document).on("click","#input_button",function(){
		
		var selected_comic_title = $("textarea[name='titles']").val();
		var recommend = $("#recommend");
                var $node = $("<div>").text(selected_comic_title).attr("class","center");
                recommend.append($node);//centerの画面表示   
                $(".center").css({
                	//"background-color":"blue"
                	"background-image":"url(../~artuhr0912/image/"+ selected_comic_title +".jpg)"
        })

		var selected_comic_gernes = []
		for (var i = 0; i < comic_data.length; i++){
			if (comic_data[i].title.indexOf(selected_comic_title) !== -1){
				selected_comic_gernes.push(comic_data[i].genres)
			}
		}
		
		//////////////////////////////////////////////////////////
		//input dataをコサイン類似度で求めたい場合ExpectLikeComicを使う
		//////////////////////////////////////////////////////////
	  	
	  	related_topics = []//共起する語が含まれるtopic
	  	for (var i = 0 ; i < topic_data.length; i++){
	  		var count = 0;
	  		for (var j = 0; j < selected_comic_gernes[0].length; j++){
	  			if ($.inArray(selected_comic_gernes[0][j],topic_data[i].genre) !== -1){
	  				if (count > 0){                                                               //共起トピック数判定
	  					related_topics.push(topic_data[i].genre)
	  					break;
	  				}else{
	  					count = count + 1; 
	  				}
	  			}
	  		}
	  	}

	  	//提示されるトピックの数が多すぎる可能性があるので最大数を6に設定
	  	selected_topics = []
	  	selected_topic_num = Selected(related_topics.length,6)
	  	for (var i = 0;i< selected_topic_num.length; i++){
	  		selected_topics.push(related_topics[i])
	  	}

	  	////////////////////////////////////////////
		//related_topics 全トピック
		//selected_topics ランダムに選定したトピック
		////////////////////////////////////////////


		nodes_topics = NodesTopic(selected_topics);//関連topicのdiv　
		nodes_topics_area = TopicArea(selected_topics);//関連トピックの背景のdiv
		DrawFunction(nodes_topics)

	  	r = 300;
	  	spread_topics = SpreadTopics(nodes_topics,r,comic_data);
	  	spread_topics_area = SpreadTopicsArea(nodes_topics_area,r)

	  	spread_comics = SpreadComics(spread_topics[0],spread_topics[1]);
	  	$("#like_comic_titles").remove();
	});
})