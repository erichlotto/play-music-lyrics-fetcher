jQuery.getJSON("../manifest.json",function(data) {
	document.title = data.name+" Options";
	$("#warning").text(data.name+" proudly relies on Vagalume API.");
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


$( "#clear_cache" ).click(function() {
//	showFeedback($("#clear_cache_feedback"), 'teste', 'green');
	showFeedback($("#clear_cache_feedback"), 'Please wait...');
	var timeout = setTimeout(function(){showFeedback($("#clear_cache_feedback"), 'Fail', 'red');},1000);
	chrome.storage.local.clear(function(obj){
		chrome.storage.sync.clear(function(obj){
			clearTimeout(timeout);
			showFeedback($("#clear_cache_feedback"), 'Success', 'green');
			chrome.storage.sync.set({'autoScroll': $( "#auto_scroll" ).is(":checked")});
			chrome.storage.sync.set({'timedLyrics': $( "#timed_lyrics" ).is(":checked")});
		});
	});
//	$("#clear_cache_feedback").text('mimimi');
//	chrome.storage.sync.set({'autoScroll': $( "#auto_scroll" ).is(":checked")});
});

function showFeedback(elm, txt, color){
	if(!color)color='#888';
	elm.text(txt);
	elm.css("opacity", 1);
	elm.css("color", color);
	setTimeout(function(){
		elm.css("opacity", 0);
	},3000);
}