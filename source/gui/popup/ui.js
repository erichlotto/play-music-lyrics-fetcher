jQuery.getJSON("/manifest.json",function(data) {
	document.title = data.name;
});

var currentLyrics;
var songTimingDelay = 0;
var autoScroll = true;

function onLyricsLoadStart(){
  $("#status").text("Lyrics Load Started");
  $("#status").show();
  $("#info").hide();
}

function onLyricsLoadFinished(lyrics){
	currentLyrics = lyrics;

	$("#status").hide();
	$("#info").show();
	$("#artist").text(lyrics.artist);
	$("#track").text(lyrics.track);
	if(lyrics.timmed.length>0){
        $("#lyrics").empty();
		for(i in lyrics.timmed){
			$("#lyrics").append("<p class=\"lyrics_line\">"+lyrics.timmed[i].text.trim()+"</p>");
			$("#lyrics").css("display", "block");
		}
	} else {
		$("#lyrics").text(lyrics.static);
		$("#lyrics").css("white-space", "pre");
	}
	$("#lyrics").css("margin-top", $("#title").height() + 36);

	document.title = lyrics.artist + " - " + lyrics.track;
}


function onLyricsLoadError(error){
  $("#status").text(error);
  $("#status").show();
  $("#info").hide();
}

function onPositionChanged(position){
	if(!currentLyrics || currentLyrics.timmed.length < 1)return;
	for(var i=currentLyrics.timmed.length-1; i>=0; i--){
		if((currentLyrics.timmed[i].enter < position.position-songTimingDelay) || i == 0){
			$( ".lyrics_line" ).removeClass( "current" );
			$( ".lyrics_line:eq("+i+")" ).addClass( "current" );
            if(autoScroll)
                smoothScrool();
			break;
		}

	}
}


function smoothScrool(){
    $('html, body').animate({
        scrollTop: $(".current").offset().top-140
    }, 100);
}

$(window).mousemove(function(){
	console.log('move');
});
