jQuery.getJSON("../manifest.json",function(data) {
	document.title = data.name+" Options";
	$("#warning").text(data.name+" proudly relies on Vagalume API.");
	$("#title").text(data.name);

});


$( "#timed_lyrics" ).change(function() {
	chrome.storage.sync.set({'timedLyrics': $( "#timed_lyrics" ).is(":checked")});
	document.getElementById("auto_scroll").disabled = !$( "#timed_lyrics" ).is(":checked");

});

chrome.storage.sync.get('timedLyrics', function(obj) {
	$('#timed_lyrics').attr('checked', obj.timedLyrics);
	document.getElementById("auto_scroll").disabled = !$( "#timed_lyrics" ).is(":checked");
});

$( "#auto_scroll" ).change(function() {
	chrome.storage.sync.set({'autoScroll': $( "#auto_scroll" ).is(":checked")});
});

chrome.storage.sync.get('autoScroll', function(obj) {
	$('#auto_scroll').attr('checked', obj.autoScroll);
});

