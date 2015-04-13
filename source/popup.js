var lyricsSyncInterval;
var syncedLyricsWithTiming;
var songTimingDelay=0;
var autoScroll=true;


jQuery.getJSON("manifest.json",function(data) {
	document.title = data.name;
});


chrome.tabs.getSelected(null, function(tab) {
	chrome.tabs.sendMessage(tab.id, {query:"getInfo" },
		function(response) {
			// We need to check if the user is actually playing a song
			if(!response.currentSong || !response.currentArtist){
				if(!response.isPlaying){
					$("#status").html("Play a song first ;)");
				} else {
					showInputFields("We could not identify your song, <br/>please use the form above.", response.currentArtist, response.currentSong);
				}
			}
			else{
				fetchLyrics(response.currentArtist, response.currentSong);
			}
		}
	);
});

var examples = [["Led Zeppelin","Kashmir"],
				["Queen","Bohemian Rhapsody"],
				["Kiss","Strutter"],
				["Pearl Jam","Even Flow"],
				["Bob Dylan","Like a Rolling Stone"],
				["John Lennon","Imagine"],
				["The Beatles","Hey Jude"],
				["Nirvana","Smells Like Teen Spirit"],
				["U2","One"],
				["Dire Straits","Sultans of Swing"],
				["Bon Jovi","Livin' on a Prayer"],
				["Led Zeppelin","Stairway to Heaven"],
				["Black Sabbath","Paranoid"],
				["Iron Maiden","The Number of the Beast"],
				["Sex Pistols","Anarchy in the UK"],
				["Aerosmith","Dream On"]];

function showInputFields(popupTitle, artist, track){
	$("#top_bar").css("display","none");
	var sortedExample = examples[Math.floor(Math.random()*examples.length)];
	$("#status").html('<p>'+popupTitle+'</p>'+
'<form id="fix_song_info_form" method="post">'+
'<label style="font-size:.7em;margin:5px;color:#fb8521;font-weight: bolder;" for="artist">Artist:</label>'+
'<input style="width:-webkit-calc(100% - 25px); padding:5px; margin:5px;font-size:1em;" id="artist" class="contato_text" type="text" name="artist" placeholder="e.g. '+sortedExample[0]+'" value="'+artist+'" autofocus><br/>'+
'<label style="font-size:.7em;margin:5px;color:#fb8521;font-weight: bolder;" for="artist">Track:</label>'+
'<input style="width:-webkit-calc(100% - 25px); padding:5px; margin:5px;font-size:1em;" id="track" class="contato_text" type="text" name="track" placeholder="e.g. '+sortedExample[1]+'" value="'+track+'"><br/>'+

'<input id="input_fields_submit" type="image" src="ic_search_40px.png" alt="Search" ></form>'
/*'<input style="width:-webkit-calc(50% - 10px); padding:5px; margin:5px;font-size:1em;float:right" type="submit" value="Search" ></form>'*/
);
	$('#fix_song_info_form').on('submit', function () {
		if(validateFormLength())fetchLyrics($("#artist").val(), $("#track").val());
		return false; // para cancelar o envio do formulario
	});
	$('#artist').keyup(validateFormLength);
	$('#track').keyup(validateFormLength);
	validateFormLength();
}

function validateFormLength(){
	if($('#artist').val().length>0 && $('#track').val().length>0){
		$('#input_fields_submit').addClass('active');
		return true;
	} else {
		$('#input_fields_submit').removeClass('active');
		return false;
	}
}

function openPopup(artist, song, lyrics){

	chrome.runtime.getBackgroundPage(function(bgWindow) {
		bgWindow.storeBackgroundTempData(artist, song, lyrics);
		chrome.windows.create({'url': 'popup_window.html', 'type': 'detached_panel', 'width': $(window).width()+30, 'height': $(window).height()-20, 'focused':true });
		window.close();
	});
	
}


function fetchLyrics (art,mus) {
	$("#top_bar").css("display","none");
	$("#status").html("<i>Fetching lyrics...</i>");
	var data = jQuery.data(document,art + mus); // cache read
	if (data) {
		validateLyrics(data, art, mus);
		return true;
	}

	var url = "http://api.vagalume.com.br/search.php"
		+"?art="+encodeURIComponent(art)
		+"&mus="+encodeURIComponent(mus);

	// Check if browser supports CORS - http://www.w3.org/TR/cors/
	if (!jQuery.support.cors) {
		url += "&callback=?";
	}

	jQuery.getJSON(url,function(data) {
		// What we do with the data
		jQuery.data(document,art + mus,data); // cache write
		validateLyrics(data, art, mus);
	}).fail(function(){
		// Something went wrong with the request. Alert the user
		$("#status").html("There was an error trying to reach the API.");
	});
}


function validateLyrics(data,art,mus){

	if (data.type == 'exact' || data.type == 'aprox') {
		fetchTiming(data);
	} else if (data.type == 'song_notfound') {
		// Song not found, but artist was found
		// You can list all songs from Vagalume here
		showInputFields("We could not find song <b>"+mus+"</b> by "+data.art.name, data.art.name, mus);
	} else {
		// Artist not found
		showInputFields("We could not find artist <b>"+art+"</b>", art, mus);
	}
}

function fetchTiming(trackData){
	$("#top_bar").css("display","none");
	$("#status").html("<i>Fetching timing...</i>");
	var timing = jQuery.data(document,trackData.mus[0].id+"timing"); // cache read
	if (timing) {
		validateTiming(trackData, timing);
		return true;
	}

	var url = "https://app2.vagalume.com.br/ajax/subtitle-get.php?action=getBestSubtitle"
		+"&pointerID="+trackData.mus[0].id
		+"&duration=999";

	// Check if browser supports CORS - http://www.w3.org/TR/cors/
	if (!jQuery.support.cors) {
		url += "&callback=?";
	}

	jQuery.getJSON(url,function(timingData) {
		// What we do with the data
		jQuery.data(document, trackData.mus[0].id+"timing", timingData); // cache write
		validateTiming(trackData, timingData);
	}).fail(function(){
		// Something went wrong with the request. Alert the user
		$("#status").html("There was an error trying to reach the API.");
	});

}

function validateTiming(trackData, timingData){
	if (timingData.subtitles) {
		showLyrics(trackData, timingData);
	} else {
		// Subtitle not found
		showLyrics (trackData);
	}
}


function showLyrics (trackData, timingData) {
	var top = "<h2 style=\"margin-top:30px;\">"+trackData.mus[0].name + "</h2><br/><i>by <h4>" +trackData.art.name+"</h4></i><br/><br/>";

	if(timingData){
		// Timing found, show awesome lyrics
		$("#status").html(top);
		syncedLyricsWithTiming = timingData.subtitles[0].text_compressed;
		for(var i=0; i<syncedLyricsWithTiming.length; i++){
			$("#status").html($("#status").html() + "<p class=\"lyrics_line\">"+syncedLyricsWithTiming[i][0]+"</p>");
		}
		lyricsSyncInterval = setInterval(timeCheck, 300);
		$("#songTimingDelayUp").click(function(){songTimingDelay+=.5; $("#songTimingDelayStatus").text(songTimingDelay+" s")});
		$("#songTimingDelayDown").click(function(){songTimingDelay-=.5; $("#songTimingDelayStatus").text(songTimingDelay+" s")});
		$("#automatic_scroll").click(function(){autoScroll=true; $("#automatic_scroll").css("display","none")});
	} else {
		// No timing found, simply print lyrics text
		$("#status").html(top+trackData.mus[0].text);
	}
		$("#status").css("white-space", "pre");
		$("#top_bar").css("display","inherit");
		$("#new_window").click(function(){openPopup(trackData.art.name, trackData.mus[0].name, trackData.mus[0].text);});
		$("#wrong_lyric").click(function(){showInputFields("Wrong lyric?<br/>Please fill the form above and try a new search.", trackData.art.name, trackData.mus[0].name);});
}

$(document).ready(function(){
	$(window).bind('mousewheel DOMMouseScroll mousedown', function(event){
		$( 'html, body' ).stop( true );
        autoScroll=false;
		$("#automatic_scroll").css("display","inherit");
	});
})

function timeCheck(){
chrome.tabs.getSelected(null, function(tab) {
	chrome.tabs.sendMessage(tab.id, {query:"getPosition" },
		function(response) {

				if(response.position){
					$("#songTimingDelay").css("display", "inherit");
					for(var i=0; i<syncedLyricsWithTiming.length; i++){
						if(syncedLyricsWithTiming[i][2]>response.position-songTimingDelay){
							$( ".lyrics_line" ).removeClass( "current" );
							$( ".lyrics_line:eq("+i+")" ).addClass( "current" );
							if(autoScroll)
							$('html, body').animate({
								scrollTop: $(".current").offset().top-100
							}, 100);
							break;
						}
					}
				} 

		}
	);
});

}

