$(function(){
	$(document).on("click",".related_comic",function(){
		
		////////////////////////////////////////////
		//クリックしたコミックの中央への遷移、属性の変換
		////////////////////////////////////////////

		$(this).data("balloon").remove();//選択時に展開しているballoonを削除
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

		$(".center").removeClass(function(){//中央のコミックを削除
			$(this).remove();
		})
		$(".topic").remove();//関連トピックを削除
		$(".topic_area").remove();

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
		
		nodes_topics = [];
		nodes_topics_area = [];
		for (var i =0; i<related_topics.length;i++){
			nodes_topic = CreateNodeTopic(related_topics[i].genre)
			nodes_topic_area = CreateTopicArea(related_topics[i].genre)
			nodes_topics.push(nodes_topic)
			nodes_topics_area.push(nodes_topic_area)
		}

		var $topics = $("#topics");
	  	for (var i = 0; i < nodes_topics.length; i++){
	  		var $each_topics = nodes_topics[i];
	  		$topics.append($each_topics);	
	  		$each_topics.css({
	  			left:center_posX,
				top:center_posY,
	  		})
		}

		var $topics_area = $("#topic_area");
		for (var i = 0; i < nodes_topics_area.length; i++){
	  		var $hoge = nodes_topics_area[i];
	  		$topics_area.append($hoge);	
	  		$hoge.css({
	  			left:center_posX-100,
    			top:center_posY-100,
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
			var history_node = history_nodes[i];
			history.append(history_node);
			history_node.css({
				left:left+"px",
				top:"90%",
				width:"51.2px",
	            height:"76.8px",
	            position:"absolute",
	            top:"85%",
	            "background-image":"url(../~artuhr0912/img/"+ history_node.text() +".jpg)"
			})
		}
	})

	$(document).on("mouseover",".histories",function(){
		for (var i =0; i<clicked_comic_data.length; i++){
			if($(this).text().indexOf(clicked_comic_data[i].title) !== -1){
				$(this).showBalloon({
					contents:"<div id = balloon>" + clicked_comic_data[i].genres + "</div>"
					// contents:"<div id = balloon>" + "あいうえお" + "<br>" + "かきくけこ" + "</div>"
				});
			}
		}
	})

	$(document).on("mouseout",".histories",function(){
		$(this).hideBalloon()
	})

	//////////////////////////////////////////////////////////////////////
	//historyに格納されたコミックを選択するとそのコミックを中心とした探索を再開できる
	//////////////////////////////////////////////////////////////////////

	$(document).on("click",".histories",function(){
		$(".center").removeClass(function(){//中央のコミックを削除
			$(this).remove();
		})
		$(".topic").remove();//関連トピックを削除
		$(".topic_area").remove();

		$(this).addClass("center",3000);
		$(this).removeClass("related_comic")
		$(".related_comic").not(this).remove();

		var selected_comic = $(this).text()
		var selected_comic_genres = SelectedComicGenres(selected_comic,comic_data).genres

		related_topics = []//共起する語が含まれるtopic
	  	for (var i = 0 ; i < topic_data.length; i++){
	  		for (var j = 0; j < selected_comic_genres.length; j++){
	  			if ($.inArray(selected_comic_genres[j],topic_data[i].genre) !== -1){
	  				related_topics.push(topic_data[i].genre)
	  				break;
	  			}
	  		}
	  	}
	  	nodes_topics = NodesTopic(related_topics);//関連topicのdiv
		nodes_topics_area = TopicArea(related_topics);

		var selected = $("#recommend");
		var $node = $("<div>").text(selected_comic).attr("class","center");
		selected.append($node);
		$(".center").css({
           "background-image":"url(../~artuhr0912/img/"+ selected_comic +".jpg)"
        })
		DrawFunction(nodes_topics)

	  	r = 256;
	  	spread_topics = SpreadTopics(nodes_topics,r,comic_data);
	  	spread_topics_area = SpreadTopicsArea(nodes_topics_area,r)
	  	spread_comics = SpreadComics(spread_topics[0],spread_topics[1]);
	})
})








