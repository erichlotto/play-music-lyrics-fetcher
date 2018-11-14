jQuery.getJSON("/manifest.json",function(data) {
	document.title = data.name;
	chrome.storage.sync.get('last_version', function(obj) {
		var lastVersion = obj.last_version;
		if(!lastVersion || lastVersion != data.version){
		    chrome.storage.local.clear();
		    document.body.innerHTML = releaseNotes();
		}
		chrome.storage.sync.set({ 'last_version': data.version });
	});
});

function releaseNotes(){
    return '<p id="status"><h3 style="width: 500px">Changelog</h3>' +
		'<ul>v 1.0.16' +
            "<li>Changed extension title to Lyrics Fetcher, complying with Google's policy</li>" +
		'</ul><ul>v 1.0.14' +
            "<li>Added Streamsquid support</li>" +
            "<li>Player tab no longer needs to be refreshed after extension install or update</li>" +
		'</ul><ul>v 1.0.13' +
            "<li>Fixed timed lyrics not working properly on Spotify</li>" +
		'</ul><ul>v 1.0.12' +
            "<li>Genius integration fixed</li>" +
            "<li>Fixed timed lyrics not showing for non-US songs</li>" +
            "<li>Added option to disable window resizing in detached mode</li>" +
		// '</ul><ul>v 1.0.8' +
         //    "<li>Fix for YouTube's new layout</li>" +
		// '</ul><ul>v 1.0.7' +
         //    '<li>Fixed Pandora integration</li>' +
         //    '<li>Added option to disable timed lyrics in (check the options page)</li>' +
         //    '<li>Fixed DarkLyrics integration</li>' +
        '</ul></p>';
}
