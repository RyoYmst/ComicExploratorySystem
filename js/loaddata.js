function LoadTopicJson(){
  json_data = [];
  $.ajax({
    url:"../~artuhr0912/data/topic_stop.json",//topics
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


function LoadComicJson(){
  json_data = [];
  $.ajax({
    url:"../~artuhr0912/data/output_stop.json",//output//tfidf_data.json
    dataType:"json",
    async:false,
    data:{"data":"data"}
  })
  .success(function(json){
    // console.log(json)
    for (var i = 0; i < json.length ; i++){
        json_data.push(json[i]);
      }
    })
    .error(function(msg){
      console.log("error(LoadJson)");
    })
  return json_data;
  }