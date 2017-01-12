jQuery.getJSON("../manifest.json",function(data) {
	document.title = data.name;
});
chrome.runtime.getBackgroundPage(function(bgWindow) {
	var top = "<h2>"+bgWindow.getBackgroundTempData().song + "</h2><br/><i>by <h4>" +bgWindow.getBackgroundTempData().artist+"</h4></i><br/><br/>";
	$("#status").html(top+bgWindow.getBackgroundTempData().lyrics);
	increseWindowWidthToFitContent();
});

function increseWindowWidthToFitContent(){
	var statusWidth = $("#status").innerWidth();
	var $window = $(window);
	
	function hasHorizontalScrollbar(){
		return statusWidth >= $window.width();
	}
	
	function adjustWidth(){
		if(!hasHorizontalScrollbar()){
			return;
		}
		
		window.resizeTo(window.outerWidth+5, window.outerHeight);
		
		// use setTimeout so browser have time to reflow/update/recalculate dimensions for the next call; more info:
		// http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
		// http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
		setTimeout(adjustWidth, 0);
	}
	
	adjustWidth();
};