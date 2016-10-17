jQuery.getJSON("../manifest.json",function(data) {
	document.title = data.name+" Options";
	$("#warning").text(data.name+" proudly relies on Vagalume API.");
});

/* timed lyrics */
$( "#timed_lyrics" ).change(function() {
	chrome.storage.sync.set({'timedLyrics': $( "#timed_lyrics" ).is(":checked")});
	document.getElementById("auto_scroll").disabled = !$( "#timed_lyrics" ).is(":checked");

});
chrome.storage.sync.get('timedLyrics', function(obj) {
	$('#timed_lyrics').attr('checked', obj.timedLyrics);
	document.getElementById("auto_scroll").disabled = !$( "#timed_lyrics" ).is(":checked");
});

/* AUTO SCROLL */
$( "#auto_scroll" ).change(function() {
	chrome.storage.sync.set({'autoScroll': $( "#auto_scroll" ).is(":checked")});
});
chrome.storage.sync.get('autoScroll', function(obj) {
	$('#auto_scroll').attr('checked', obj.autoScroll);
});

/* HIGH CONTRAST */
$( "#high_contrast" ).change(function() {
	chrome.storage.sync.set({'high_contrast': $( "#high_contrast" ).is(":checked")});
});
chrome.storage.sync.get('high_contrast', function(obj) {
	var highContrast = obj.high_contrast;
	if(!highContrast) highContrast = true;
	$('#high_contrast').attr('checked', highContrast);
});

/* DETACH */
$( "#display_new_window" ).change(function() {
	chrome.storage.sync.set({'display_new_window': $( "#display_new_window" ).is(":checked")});
});
chrome.storage.sync.get('display_new_window', function(obj) {
	var displayNewWindow = obj.high_contrast;
	if(!displayNewWindow) displayNewWindow = false;
	$('#display_new_window').attr('checked', displayNewWindow);
});


/* OVERLAY */
$( "#overlay" ).change(function() {
	chrome.storage.sync.set({'overlay': $( "#overlay" ).is(":checked")});
});
chrome.storage.sync.get('overlay', function(obj) {
	$('#overlay').attr('checked', obj.overlay);
	alert(obj.overlay);
});

/* THEME */
$( "#theme_light" ).change(function() {
	chrome.storage.sync.set({'theme': "light"});
});
$( "#theme_dark" ).change(function() {
	chrome.storage.sync.set({'theme': "dark"});
});
chrome.storage.sync.get('theme', function(obj) {
	var theme = obj.theme;
	if(!theme) theme = "light";
	$('#theme_light').attr('checked', theme == "light");
	$('#theme_dark').attr('checked', theme == "dark");
});

/* FONT SIZE */
$( "#font_small" ).change(function() {
	chrome.storage.sync.set({'font_size': "font_size_small"});
});
$( "#font_normal" ).change(function() {
	chrome.storage.sync.set({'font_size': "font_size_normal"});
});
$( "#font_large" ).change(function() {
	chrome.storage.sync.set({'font_size': "font_size_large"});
});
$( "#font_xlarge" ).change(function() {
	chrome.storage.sync.set({'font_size': "font_size_xlarge"});
});
chrome.storage.sync.get('font_size', function(obj) {
	var fontSize = obj.font_size;
	if(!fontSize) fontSize = "font_size_normal";
	$('#font_small').attr('checked', fontSize == "font_size_small");
	$('#font_normal').attr('checked', fontSize == "font_size_normal");
	$('#font_large').attr('checked', fontSize == "font_size_large");
	$('#font_xlarge').attr('checked', fontSize == "font_size_xlarge");
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
