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
	document.title = "Play Music Lyrics Fetcher";
}

function onLyricsLoadFinished(lyrics){
	currentLyrics = lyrics;

	$("#status").hide();
	$("#info").show();
	$("#artist").text(lyrics.artist);
	$("#track").text(lyrics.track);
	if(lyrics.timmed.length>0){
		$("#delay_panel").show();
        $("#lyrics").empty();
		for(i in lyrics.timmed){
			$("#lyrics").append("<p class=\"lyrics_line\">"+lyrics.timmed[i].text.trim()+"</p>");
			$("#lyrics").css("display", "block");
		}
	} else {
		$("#delay_panel").hide();
		$("#bt_autoscroll").hide();
		$("#lyrics").text(lyrics.static);
		$("#lyrics").css("white-space", "pre");
	}
	$("#lyrics").css("margin-top", $("#title").height() + 36);

	document.title = lyrics.artist + " - " + lyrics.track;
	$('html, body').animate({
			scrollTop: 0
	}, 100);
}


function onLyricsLoadError(error){
  $("#status").text(error);
  $("#status").show();
  $("#info").hide();
	document.title = "Play Music Lyrics Fetcher";
}

function onPositionChanged(position){
	if(!currentLyrics || currentLyrics.timmed.length < 1){
		return;
	}
	$("#delay_label").text(position.delay + "s");
	for(var i=currentLyrics.timmed.length-1; i>=0; i--){
		if((currentLyrics.timmed[i].enter < position.position-position.delay) || i == 0){
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
        scrollTop: $(".current").offset().top - ($(window).height()/3)
    }, 100);
}

$(document).ready(function(){
	if(docked){
		$("#bt_newwindow").click(openWindow);
	} else {
		$("#bt_newwindow").hide();
	}
	turnOnAutoScroll();
	$("#bt_autoscroll").click(turnOnAutoScroll);
	$("#bt_delay_bwd").click(delayDown);
	$("#bt_delay_fwd").click(delayUp);
	$("#tools").mouseenter(function(){
		clearTimeout(visibilityTimeout);
	}).mouseleave(function(){
		$(window).mousemove();
	});
});

function turnOnAutoScroll(){
	$("#bt_autoscroll").hide();
	autoScroll = true;
	if($(".current").length > 0)
	smoothScrool();
}

var visibilityTimeout;
var lastScrollMilis; // The autoscroll triggers the mousemove event, so we need a workaround
$(window).mousemove(function(event){
	var container = $("#tools");
	if (!container.is(event.target) // if the target of the click isn't the container...
		&& container.has(event.target).length === 0) // ... nor a descendant of the container
	{
		var currentTimeMilis = new Date().getTime();
		if(currentTimeMilis < lastScrollMilis + 50){
			$("#tools").removeClass("hide");
			clearTimeout(visibilityTimeout);
			visibilityTimeout = setTimeout(function(){
				$("#tools").addClass("hide");
			}, 1000);
			console.log("mousemove");
		}
		lastScrollMilis = currentTimeMilis;
	}
});

$(document).keypress(function(e) {
  if(e.which == 43) {
		delayUp();
  } else if(e.which == 45){
		delayDown();
	}
});

$(window).bind('mousewheel DOMMouseScroll mousedown', function(event){
	var container = $("#tools");
	if (!container.is(event.target) // if the target of the click isn't the container...
		&& container.has(event.target).length === 0) // ... nor a descendant of the container
	{
		$( 'html, body' ).stop( true );
		autoScroll=false;
		$("#bt_autoscroll").show();
	}
});