jQuery.getJSON("../manifest.json",function(data) {
	document.title = data.name+" Options";
	$("#warning").text(data.name+" proudly relies on Vagalume API.");
});

