jQuery.getJSON("../manifest.json",function(data) {
	document.title = data.name;
	chrome.storage.sync.get('last_version', function(obj) {
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
	});
});



chrome.storage.sync.get('theme', function(obj) {
var theme = obj.theme;
if(!theme) theme = "light";
console.log("THEME: "+theme);
	$('body').addClass(theme);
});
chrome.storage.sync.get('font_size', function(obj) {
	var fontSize = obj.font_size;
	if(!fontSize) fontSize = "normal";
	console.log("FONT SIZE: "+fontSize);
	$('body').addClass(fontSize);
});

chrome.storage.sync.get('high_contrast', function(obj) {
	var highContrast = obj.high_contrast;
	if(highContrast==undefined) highContrast = true;
	console.log("HIGH CONTRAST: " + highContrast);
	$('body').addClass(highContrast ? "high_contrast" : "");
});

chrome.storage.sync.get('display_new_window', function(obj) {
	var displayNewWindow = obj.display_new_window;
	if(displayNewWindow==undefined) displayNewWindow = false;
	console.log("DISPLAY NEW WINDOW: " + displayNewWindow);
	$('#top_bar_new_window').css("display", displayNewWindow ? "inherit" : "none");
});




function openPopup(artist, song, lyrics){
	chrome.runtime.getBackgroundPage(function(bgWindow) {
		bgWindow.storeBackgroundTempData(artist, song, lyrics);
		
		// if there is a window with the same id, it'll be refreshed
		// instead of creating another window
		var lyricsPopup = window.open(
			'../pages/popup_window.html',
			'play-music-lyrics-fetcher-window'
		);
		lyricsPopup.focus();
		
		window.close();
	});
}

function restart(){
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {query:"getInfo" },
			function(response) {
				// We need to check if the user is actually playing a song
				$("#top_bar_song_delay").css("display", "none");
				$("#top_bar_autoscroll").css("display", "none");
				clearInterval(lyricsSyncInterval);
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
}

function toggleOverlay(){
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(tab.id, {query:"toggleOverlay" },
		function(response){
		window.close();
	})});
}

function displayReleaseNotes(version){
	var msg="<h3>Release notes for version " + version + "</h3><ul style='white-space:initial; width:300px;'>"+
	"<li>Fixed High Contrast and Open in New Window toggles</li>"+
	"</ul><small>Simply close this window to dismiss and open it again to display lyrics</small>";
	$("#status").html(msg);
}
