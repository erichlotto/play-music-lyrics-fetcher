
chrome.tabs.getSelected(null, function(tab) {
	chrome.tabs.sendMessage(tab.id, {query:"getInfo" },
		function(response) {

			// We need to check if the user is actually playing a song
			if(!response.isPlaying){
				$("#status").html("Play a song first ;)");
				return;
			}

			// Check if we already hare this song cached
			if(response.cachedLyric.length>0){
					// It's cached, fill the popup
					fillPopUpWithLyrics(response.currentArtist, response.currentSong, response.cachedLyric/*+"<br/><small style=\"float:right;color:red;\">cached</small>"*/);
			} else {

				// We dont have it cached, make the request to the external server
				$.get( "http://erichlotto.com/api/lyrics/?artist="+response.currentArtist+"&song="+response.currentSong, function( data ) {

					// Fill the popup
					fillPopUpWithLyrics(response.currentArtist, response.currentSong, data);

					// Pass back the lyrics to content_script, so if the user opens the popup again we don't need to fetch the song twice
					chrome.tabs.sendMessage(tab.id, {query:"storeLyric", artist:response.currentArtist, song:response.currentSong, lyrics: data});
   				}).fail(function(){
					// Something went wrong with the request. Alert the user
					$("#status").html("There was an error processing your request.");
				});
			}
		}
	);
});

function fillPopUpWithLyrics(artist, song, lyrics){
	var top = "<h2>"+song + "</h2><br/><i>by <h4>" +artist+"</h4></i><br/><br/>";
	$("#status").html(top+lyrics);
	$("#top_bar").css("display","inherit")
	$("#new_window").click(function(){openPopup(artist, song, lyrics);});
}

function openPopup(artist, song, lyrics){
	chrome.runtime.getBackgroundPage(function(bgWindow) {
		bgWindow.storeBackgroundTempData(artist, song, lyrics);
		chrome.windows.create({'url': 'popup_window.html', 'type': 'detached_panel', 'width': $(window).width()+20, 'height': $(window).height()-20, 'focused':true }, function(window) {
		});
	});
}
