$( "#timed_lyrics" ).change(function() {
	chrome.storage.sync.set({'timedLyrics': $( "#timed_lyrics" ).is(":checked")});
});
chrome.storage.sync.get('timedLyrics', function(obj) {
	$('#timed_lyrics').attr('checked', obj.timedLyrics!=false);
});
$( "#genius_access_token" ).change(function() {
  chrome.storage.sync.set({'geniusAccessToken': $( "#genius_access_token" ).val().trim()});
});
chrome.storage.sync.get('geniusAccessToken', function(obj) {
  $('#genius_access_token').val(obj.geniusAccessToken);
});
