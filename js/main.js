$(function(){
  TopicData = LoadTopicJson();
  ComicData = LoadComicJson();

  $(document).on("click","#input_button",function(){
  	ExpectLikeComic();
})
})