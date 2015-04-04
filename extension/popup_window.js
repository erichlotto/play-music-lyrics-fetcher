chrome.runtime.getBackgroundPage(function(bgWindow) {
	fillPopUpWithLyrics(bgWindow.getBackgroundTempData().artist, bgWindow.getBackgroundTempData().song, bgWindow.getBackgroundTempData().lyrics);
});

function fillPopUpWithLyrics(artist, song, lyrics){
	var top = "<h2>"+song + "</h2><br/><i>by <h4>" +artist+"</h4></i><br/><br/>";
	$("#status").html(top+lyrics);
}
