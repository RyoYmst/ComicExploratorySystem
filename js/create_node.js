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