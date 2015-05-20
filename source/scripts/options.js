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

$( "#overlay" ).change(function() {
	chrome.storage.sync.set({'overlay': $( "#overlay" ).is(":checked")});
});
chrome.storage.sync.get('overlay', function(obj) {
	$('#overlay').attr('checked', obj.overlay);
	alert(obj.overlay);
});


$("#clear_cache").click(function() {
	clearTimeout(failureTimeout);
	showFeedback($("#clear_cache_feedback"), 'Please wait...');
	failureTimeout = setTimeout(function(){showFeedback($("#clear_cache_feedback"), 'Something went wrong', 'red');},1000);
	chrome.storage.local.clear(function(obj){
		chrome.storage.sync.clear(function(obj){
			clearTimeout(failureTimeout);
			showFeedback($("#clear_cache_feedback"), 'Success', 'green');
			chrome.storage.sync.set({'autoScroll': $( "#auto_scroll" ).is(":checked")});
			chrome.storage.sync.set({'timedLyrics': $( "#timed_lyrics" ).is(":checked")});
		});
	});
});

var opacityTimeout;
var failureTimeout;
function showFeedback(elm, txt, color){
	clearTimeout(opacityTimeout);
	if(!color)color='#888';
	elm.text(txt);
	elm.css("opacity", 1);
	elm.css("color", color);
	opacityTimeout = setTimeout(function(){
		elm.css("opacity", 0);
	},3000);
}