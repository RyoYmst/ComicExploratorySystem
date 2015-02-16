function LoadJson(){
  json_data = [];
  $.ajax({
    url:"../~artuhr0912/data/data.json",
    dateType: "json",
    async:false,
    data:{"data" : "data"}
  })
    .success(function(json){
      for (var i = 0; i < json.length ; i++){
        json_data.push(json[i]);
      }
    })
    .error(function(msg){
      console.log("error(LoadJson)");
    })
  return json_data;
};


function ExpectLikeComic(){
        var hoge = $("textarea[name='titles']").val();
        var tmp = [];
        title_list = hoge.split(",");
        if(title_list.length === 0){
            $("#test").text("コミックタイトルを入力して下さい");
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
                $("#expect_like_comic").text(data.title);
        })
       .error(function(msg){
              console.log(msg);
              console.log("error");
        });
        return tmp;
}


function plotTitle(titles){
  var pos = $("#expect_like_comic").offset()
  var rad = 30//360/titles.length//プロットする角度
  var centerX = pos.left;
  var centerY = pos.top;

  //console.log($(window).width()/2)//原点X軸
  //console.log($(window).height()/2)//原点Y軸
   r = 200;

  for (var i=0 ; i < titles.length ; i++){
    var rad = 2 * Math.PI * (i/titles.length);
    //var x = r * Math.cos(rad);
    //var y = r * Math.sin(rad); 
    $("<div class = titles>"+titles[i]+"</div>").appendTo("body");    
    $(".titles").css("top", pos.top + rad *Math.cos(rad));//cos
    $(".titles").css("left", pos.left + rad * Math.sin(rad));//sin
    rad = rad + rad;
  }

  //$("<div class = titles>"+title+"</div>").appendTo("body");
}


$(function(){
    var DbComic = LoadJson();//収集したコミックのタイトルとジャンル　title: genre:
    $(document).on("click","#button",function(){
        var RecomendComic = ExpectLikeComic();//レコメンドされたコミック
        genres = RecomendComic[1]
        plot_location = []

        for (var i =0; i < genres.length ; i++){
          $("<div class = genres>"+genres[i]+"</div>").appendTo("body");
        }
        for (var i=0; i< DbComic.length; i++){
          for (var j = 0; j<genres.length; j++){
            if ($.inArray(genres[j],DbComic[i].genres) != -1){
              if (RecomendComic[0] != DbComic[i].title){
                plot_location.push(DbComic[i].title)
                //plotTitle(DbComic[i].title)
                //$("<div class = titles>"+DbComic[i].title+"</div>").appendTo("body");
                break
              };
            };
          }
        }
         $("#lile_comic_tiltes").remove()
        plotTitle(plot_location)
        
  })


    $(document).on("click",".titles",function(){
        $("#expect_like_comic").text($(this).text());
        genres = []
        for(var i = 0; i < DbComic.length; i++){
            if ($(this).text() == DbComic[i].title){
          　    $(".genres").remove();
                $(".titles").remove();
                for (var j =0; j < DbComic[i].genres.length ; j++){
                    $("<div class = genres>"+DbComic[i].genres[j]+"</div>").appendTo("body");
                    genres.push(DbComic[i].genres[j])
                }   
            }
        }


        for (var i = 0; i< DbComic.length; i++){
            for (var j = 0 ; j < genres.length; j ++){
                if ($.inArray(genres[i],DbComic[i].genres) != -1){
                    if ($(this).text() != DbComic[i].title){
                        $("<div class = titles>"+DbComic[i].title+"</div>").appendTo("body");
                        break
                    }
                }
            }
        }
    })
})


$(document).on("mouseover",".titles",function() {
    console.log(this);
});

$(document).on("mouseover",".genres",function() {
    console.log(this);
});

























































//        $.ajax({
//            url: "data/data.json",
//            type: "GET",
//            dataType: "json"
//        })
//                   
//        .success(function(data){
//            
//            $.ajax({
//                url:"../~artuhr0912/cgi-bin/test.py",
//                type:"POST",
//                dataType:"text",
//                data: { 'query': $("textarea[name='titles']").val() }
//            })
//             .success(function(data){
//                      console.log(data);
//            })
//             .error(function(msg){
//                console.log(msg)
//                console.log('error')
//            });
//        })
//                   
//        .error(function(msg) {
//            console.log(msg);
//        });






/*
 $(function() {
 $(document).on("click","#button",function(){
 var hoge = $("textarea[name='titles']").val();
 title_list = hoge.split(",");
 
 $.ajax({
 url: "data/data.json",
 type: "GET",
 dataType: "json"
 })
 .success(function(data){
 var tmp = [];
 for(var i = 0; i < data.length; i++){
 tmp.push(data[i]);
 }
 console.log(title_list);
 for(var i = 0; i< tmp.length; i ++){
 console.log(tmp[i].title)
 }
 })
 .error(function(msg) {
 console.log(msg);
 });
 })
 });
 */



