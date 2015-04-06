jQuery.getJSON("manifest.json",function(data) {
	document.title = data.name;
});
chrome.runtime.getBackgroundPage(function(bgWindow) {
	var top = "<h2>"+bgWindow.getBackgroundTempData().song + "</h2><br/><i>by <h4>" +bgWindow.getBackgroundTempData().artist+"</h4></i><br/><br/>";
	$("#status").html(top+bgWindow.getBackgroundTempData().lyrics);
});
