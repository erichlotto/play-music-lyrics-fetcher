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
					$("#status").html('<p>We could not identify your song, <br/>please use the form above.</p>'+
									'<form method="post" id="submit_form">'+
									'<input style="width:-webkit-calc(100% - 25px); padding:5px; margin:5px;font-size:1em;" id="artist" class="contato_text" type="text" name="artist" placeholder="Artist" value="'+response.currentArtist+'" autofocus><br/>'+
									'<input style="width:-webkit-calc(100% - 25px); padding:5px; margin:5px;font-size:1em;" id="track" class="contato_text" type="text" name="track" placeholder="Track" value="'+response.currentSong+'"><br/>'+
									'<input style="width:-webkit-calc(50% - 10px); padding:5px; margin:5px;font-size:1em;float:right" type="submit" value="Search" ></form>');
					$('#submit_form').on('submit', function () {
						fetchLetra($("#artist").val(), $("#track").val());
						return false; // para cancelar o envio do formulario
					});
				}
			}
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
		chrome.windows.create({'url': 'popup_window.html', 'type': 'detached_panel', 'width': $(window).width()+30, 'height': $(window).height()-20, 'focused':true });
		window.close();
	});
	
}



function showLetra (data,art,mus,arrayid) {
	if (! arrayid) arrayid = 0;

	if (data.type == 'exact' || data.type == 'aprox') {
		// Print lyrics text
		var top = "<h2>"+data.mus[arrayid].name + "</h2><br/><i>by <h4>" +data.art.name+"</h4></i><br/><br/>";
		$("#status").html(top+data.mus[arrayid].text);
		$("#top_bar").css("display","inherit")
		$("#new_window").click(function(){openPopup(data.art.name, data.mus[arrayid].name, data.mus[arrayid].text);});
	} else if (data.type == 'song_notfound') {
		// Song not found, but artist was found
		// You can list all songs from Vagalume here
		$("#status").html("could not find song <b>"+mus+"</b> by "+data.art.name);
	} else {
		// Artist not found
		$("#status").html("could not find artist <b>"+art+"</b>");
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
		$("#status").html("There was an error trying to reach the API.");
	});
}
