function Spread(titles,r){
	for (var i=0;i<titles.length; i++){
	    var node = titles[i];
	    var centerX = node.offset().left;
	    var centerY = node.offset().top;
	    var rad = 2*Math.PI * (i/titles.length);
	    var x = r * Math.cos(rad) + centerX;
	    var y = r * Math.sin(rad) + centerY;
	    titles[i].animate({
	      left:x,
	      top:y },"slow");
	    }
}

function DrawComic(nodes_topics,x,y){
	var $comics = $("#related_comics");
    var centerX = x;//中央のコミックのX座標
    var centerY = y;//中央のコミックのY座標
  	for (var i = 0; i < nodes_topics.length; i++){
  		var $each_topics = nodes_topics[i];
  		$comics.append($each_topics);	
  		$each_topics.css({
  			left:centerX,
			top:centerY,
			zIndex:"1",
			// "background-color":"blue"
			"background-image":"url(../~artuhr0912/image/" + nodes_topics[i].text() + ".jpg)"
  		})
	}
}

$(function(){	
	$(document).on("click",".topic",function(){
		$(this).hideBalloon();
		// $(this).data("balloon").remove();//選択時に展開しているballoonを削除
		clicked_topic_data = $(this).text().split(",")
		var clicked_topic_position = $(this).position();
		var clicked_topic_posX = clicked_topic_position.left;
		var clicked_topic_posY = clicked_topic_position.top;
		var distanceX = window_center_posX - clicked_topic_posX -25;
		var distanceY = window_center_posY - clicked_topic_posY -25;
		$(this).animate({
			left:"+=" + distanceX,
	         top:"+=" + distanceY
	     },"slow");

		$(this).css({
				width:100,
				height:100,
				borderRadius:100,
				position:"absolte",
				fontSize:0		
			})
	
		$(".center").remove();
		$(".topic").not(this).remove();
		
		$(".topic_area").remove();
		$(".related_comic").remove();

		related_comics = [];
		for (var i = 0; i < comic_data.length; i++){
			var count = 0;
			for (var j = 0; j< clicked_topic_data.length;j++){
				if ($.inArray(clicked_topic_data[j],comic_data[i].genres) !== -1){
					if (count > 2){                                                     //共起数判定
						// console.log(comic_data[i])
						related_comics.push(comic_data[i]);
						break;
					}else{
						count = count + 1;
					}
				}
			}
		}

		r = 300;
		related_comic_nodes = []
		for (var i = 0; i< related_comics.length; i++){
			node = CreateNodeComic(related_comics[i])
			related_comic_nodes.push(node)
		}
		// console.log(related_comic_nodes)
		DrawComic(related_comic_nodes,window_center_posX,window_center_posY)
		spread_comic = Spread(related_comic_nodes,r)


		////////////////////////////////////////////
		//共起トピック、類似コミックの取得
		////////////////////////////////////////////
	})


	$(document).on("click",".related_comic",function(){
		////////////////////////////////////////////
		//クリックしたコミックの中央への遷移、属性の変換
		////////////////////////////////////////////
		$(this).hideBalloon();
		// $(this).data("balloon").remove();//選択時に展開しているballoonを削除
		var clicked_comic_position = $(this).position();
		var clicked_comic_posX = clicked_comic_position.left;
		var clicked_comic_posY = clicked_comic_position.top;
		var distanceX = window_center_posX - clicked_comic_posX;
		var distanceY = window_center_posY - clicked_comic_posY;
		
		$(this).animate({
			left:"+=" + distanceX,
	         top:"+=" + distanceY 
	     },"slow");

		$(".center").removeClass(function(){//中央のコミックを削除
			$(this).remove();
		})
		$(this).animate({
			width:"64px",
			height:"91px"
		},"500");
		$(".topic").remove();//関連トピックを削除
		$(".topic_area").remove();
		$(".center_topic").remove();
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
					if (count > 0){                                                                  //共起トピック数判定
						related_topics.push(topic_data[i])
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
		
		nodes_topics = [];
		nodes_topics_area = [];
		for (var i =0; i<selected_topics.length;i++){
			nodes_topic = CreateNodeTopic(selected_topics[i].genre)
			nodes_topic_area = CreateTopicArea(selected_topics[i].genre)
			nodes_topics.push(nodes_topic)
			nodes_topics_area.push(nodes_topic_area)
		}

		var $topics = $("#topics");
	  	for (var i = 0; i < nodes_topics.length; i++){
	  		var $each_topics = nodes_topics[i];
	  		$topics.append($each_topics);	
	  		$each_topics.css({
	  			left:window_center_posX,
				top:window_center_posY,
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

		r = 256;
	  	spread_topics = SpreadTopics(nodes_topics,r,comic_data);
	  	spread_topics_area = SpreadTopicsArea(nodes_topics_area,r);
	  	spread_comics = SpreadComics(spread_topics[0],spread_topics[1]);
	})
})


function HistoryNode(title){
	var node = $("<div>").text(title).addClass("histories");
	return node;
}

function HistoryNodes(titles){
	var nodes = [];
	for (var i = 0; i< titles.length; i++){
		var node = HistoryNode(titles[i]);
		nodes.push(node)
	}
	return nodes;
}

////////////////////////////////////////////
//履歴部分の処理
//履歴データの蓄積、マウスイベント
////////////////////////////////////////////

$(function(){
	clicked_comic_titles = [];
	clicked_comic_data = [];
	store_history_nodes = [];

	$(document).on("click",".center",function(){		
		
		for(var i =0; i< comic_data.length; i++){
			if (comic_data[i].title.indexOf($(this).text()) !== -1){
				clicked_comic_titles.push(comic_data[i].title);
				clicked_comic_data.push(comic_data[i]);
				break
			}
		}

		var history_nodes = HistoryNodes(clicked_comic_titles);
		store_history_nodes.push(history_nodes)
		var history = $("#history");
		for (var i =0 ; i< history_nodes.length; i++){
			var left = i * 80 + 50;
		var history_nodes = HistoryNodes(clicked_comic_titles)
		
			var history_node = history_nodes[i];
			history.append(history_node);
			history_node.css({
				left:left+"px",
				top:"90%",
				width:"51.2px",
	            height:"76.8px",
	            position:"absolute",
	            top:"85%",
	            zIndex:"1",
	            //"background-color":"blue"
	            "background-image":"url(../~artuhr0912/image/"+ history_node.text() +".jpg)"
			})
		}
	})

	// $(document).on("mouseover",".histories",function(){
	// 	for (var i =0; i<clicked_comic_data.length; i++){
	// 		if($(this).text().indexOf(clicked_comic_data[i].title) !== -1){
	// 			$(this).showBalloon({
	// 				contents:"<div id = balloon>" + clicked_comic_data[i].genres + "</div>"
	// 			});
	// 		}
	// 	}
	// })

	// $(document).on("mouseout",".histories",function(){
	// 	$(this).hideBalloon()
	// })
// })

	//////////////////////////////////////////////////////////////////////
	//historyに格納されたコミックを選択するとそのコミックを中心とした探索を再開できる
	//////////////////////////////////////////////////////////////////////

	$(document).on("click",".histories",function(){
		$(this).hideBalloon();
		// $(this).data("balloon").remove();//選択時に展開しているballoonを削除
		$(".center").removeClass(function(){//中央のコミックを削除
			$(this).remove();
		})
		$(".topic").remove();//関連トピックを削除
		$(".topic_area").remove();

		$(this).addClass("center",3000);
		$(this).removeClass("related_comic")
		$(".related_comic").not(this).remove();

		var selected_comic_title = $(this).text()//クリックした作品タイトル

		var selected_comic_genres = []
		for (var i = 0; i < comic_data.length; i++){
			if (comic_data[i].title.indexOf(selected_comic_title) !== -1){
				selected_comic_genres.push(comic_data[i].genres)
			}
		}

		related_topics = []//共起する語が含まれるtopic
	  	for (var i = 0 ; i < topic_data.length; i++){
	  		for (var j = 0; j < selected_comic_genres[0].length; j++){
	  			if ($.inArray(selected_comic_genres[0][j],topic_data[i].genre) !== -1){
	  				related_topics.push(topic_data[i].genre)
	  				break;
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
		nodes_topics_area = TopicArea(selected_topics);

		var selected = $("#recommend");
		var $node = $("<div>").text(selected_comic_title).attr("class","center");
		selected.append($node);
		$(".center").css({
			//"background-color":"blue"
        	"background-image":"url(../~artuhr0912/image/"+ selected_comic +".jpg)"
        })
		DrawFunction(nodes_topics)

	  	r = 256;
	  	spread_topics = SpreadTopics(nodes_topics,r,comic_data);
	  	spread_topics_area = SpreadTopicsArea(nodes_topics_area,r)
	  	spread_comics = SpreadComics(spread_topics[0],spread_topics[1]);		
	})
})

