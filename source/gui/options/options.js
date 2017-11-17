$( "#timed_lyrics" ).change(function() {
	chrome.storage.sync.set({'timedLyrics': $( "#timed_lyrics" ).is(":checked")});
});
chrome.storage.sync.get('timedLyrics', function(obj) {
	$('#timed_lyrics').attr('checked', obj.timedLyrics!=false);
});

$( "#resize_external_window" ).change(function() {
	chrome.storage.sync.set({'resize_external_window': $( "#resize_external_window" ).is(":checked")});
	alert($( "#resize_external_window" ).is(":checked"));
});
chrome.storage.sync.get('resize_external_window', function(obj) {
	$('#resize_external_window').attr('checked', obj.resize_external_window!=false);
});
