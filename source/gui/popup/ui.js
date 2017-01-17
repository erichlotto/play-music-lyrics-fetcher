jQuery.getJSON("/manifest.json",function(data) {
	document.title = data.name;
/*	chrome.storage.sync.get('last_version', function(obj) {
		var lastVersion = obj.last_version;
		if(!lastVersion || lastVersion != data.version){
				displayReleaseNotes(data.version);
		} else {
			chrome.storage.sync.get('overlay', function(obj) {
				if(obj.overlay)toggleOverlay();
				else restart();
			});
		}
		chrome.storage.sync.set({ 'last_version': data.version });
	});*/
});

var currentLyrics;
var songTimingDelay = 0;
var autoScroll = true;

function onLyricsLoadStart(){
  $("#status").text("Lyrics Load Started");
  $("#status").show();
  $("#fix_song_info").hide();
  $("#info").hide();
  $("#top_bar").hide();
}

function onLyricsLoadFinished(lyrics){
	currentLyrics = lyrics;

  $("#status").hide();
  $("#fix_song_info").hide();
  $("#info").show();
  $("#top_bar").show();

	$("#artist").text(lyrics.artist);
  $("#track").text(lyrics.track);
	if(lyrics.timmed.length>0){
		console.log(lyrics.timmed)
		for(i in lyrics.timmed){
			$("#lyrics").append("<p class=\"lyrics_line\">"+lyrics.timmed[i].text.trim()+"</p>");
			$("#lyrics").css("display", "inherit");
		}
	} else {
		$("#lyrics").text(lyrics.static);
		$("#lyrics").css("white-space", "pre");
	}
	$("#top_bar_new_window").off("click");
	$("#top_bar_new_window").click(function(){openPopup();});

}

function openPopup(){
	chrome.windows.create({'url': './gui/popup/popup.html', 'type': 'detached_panel', 'width': $(window).width()+30, 'height': $(window).height()-20, 'focused':true });
	window.close();
}

function onLyricsLoadError(error){
  $("#status").text(error);
  $("#status").show();
  $("#info").hide();
	$("#top_bar").hide();
	$("#fix_song_info").hide();
}

function onPositionChanged(position){
	if(currentLyrics.timmed.length < 1)return;
	console.log(currentLyrics)
	for(var i=currentLyrics.timmed.length-1; i>=0; i--){
		if((currentLyrics.timmed[i].enter < position.position-songTimingDelay) || i == 0){
			$( ".lyrics_line" ).removeClass( "current" );
			$( ".lyrics_line:eq("+i+")" ).addClass( "current" );
			if(autoScroll)
			$('html, body').animate({
				scrollTop: $(".current").offset().top-140
			}, 100);
			break;
		}

	}
  console.log(position);
}
