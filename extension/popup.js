jQuery.getJSON("manifest.json",function(data) {
	document.title = data.name;
});

chrome.tabs.getSelected(null, function(tab) {
	chrome.tabs.sendMessage(tab.id, {query:"getInfo" },
		function(response) {
			// We need to check if the user is actually playing a song
			if(!response.currentSong || !response.currentArtist)
				$("#status").html("Play a song first ;)");
			else{
				$("#status").html("<i>Fetching lyrics...</i>");
				fetchLetra(response.currentArtist, response.currentSong);
			}
		}
	);
});


function openPopup(artist, song, lyrics){

	chrome.runtime.getBackgroundPage(function(bgWindow) {
		bgWindow.storeBackgroundTempData(artist, song, lyrics);
		chrome.windows.create({'url': 'popup_window.html', 'type': 'detached_panel', 'width': $(window).width()+20, 'height': $(window).height()-20, 'focused':true });
	});
}



function showLetra (data,art,mus,arrayid) {
	if (! arrayid) arrayid = 0;

	if (data.type == 'exact' || data.type == 'aprox') {
		// Print lyrics text
		var top = "<h2>"+mus + "</h2><br/><i>by <h4>" +art+"</h4></i><br/><br/>";
		$("#status").html(top+data.mus[arrayid].text);
		$("#top_bar").css("display","inherit")
		$("#new_window").click(function(){openPopup(art, mus, data.mus[arrayid].text);});
	} else if (data.type == 'song_notfound') {
		// Song not found, but artist was found
		// You can list all songs from Vagalume here
		$("#status").text("could not find song \""+mus+"\" by "+art);
	} else {
		// Artist not found
		$("#status").text("could not find artist "+art);
	}
}

function fetchLetra (art,mus) {
	var data = jQuery.data(document,art + mus); // cache read
	if (data) {
		showLetra(data, art, mus);
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
		showLetra(data, art, mus);
	}).fail(function(){
		// Something went wrong with the request. Alert the user
		$("#status").text("There was an error processing your request.");
	});
}
