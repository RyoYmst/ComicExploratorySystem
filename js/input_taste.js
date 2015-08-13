function ExpectLikeComic(){
  	var input_taste_comics = $("textarea[name='titles']").val();
  	var tmp = []
  	title_list = input_taste_comics.split(",");
  	if (title_list.length === 0){
  		$("#comment").text("コミックタイトルを入力して下さい");
  	}
       $.ajax({
              url:"../~artuhr0912/cgi-bin/jsai_calc.py",
              type:"POST",
              dataType:"json",
              async: false,
              data: { "query": $("textarea[name='titles']").val() }
       })
       .success(function(data){
                tmp.push(data.title,data.genres);
                var recommend = $("#recommend");
                var $node = $("<div>").text(data.title).attr("class","center");
                recommend.append($node);//centerの画面表示   
                $(".center").css({
                   "background-image":"url(../~artuhr0912/img/"+ data.title +".jpg)"
                })
       		
        })
       .error(function(msg){
              console.log(msg);
              console.log("error");
        });
        return tmp;
}

