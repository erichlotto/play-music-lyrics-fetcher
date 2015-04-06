jQuery.getJSON("manifest.json",function(data) {
	document.title = data.name+" Options";
});

