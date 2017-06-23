$( "#timed_lyrics" ).change(function() {
	chrome.storage.sync.set({'timedLyrics': $( "#timed_lyrics" ).is(":checked")});
});
chrome.storage.sync.get('timedLyrics', function(obj) {
	$('#timed_lyrics').attr('checked', obj.timedLyrics!=false);
});
