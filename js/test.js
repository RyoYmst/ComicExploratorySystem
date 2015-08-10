
$(function(){

  TopicData = LoadTopicJson();
  ComicData = LoadComicJson();
  $(document).on("click","#input_button",function(){
    for (var i = 0; i < ComicData.length; i ++){
      console.log(ComicData[i].genres);
    }
  })
});


