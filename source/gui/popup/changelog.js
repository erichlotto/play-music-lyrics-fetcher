jQuery.getJSON("/manifest.json",function(data) {
	document.title = data.name;
	chrome.storage.sync.get('last_version', function(obj) {
		var lastVersion = obj.last_version;
		if(!lastVersion || lastVersion != data.version){
		    document.body.innerHTML = releaseNotes();
		}
		chrome.storage.sync.set({ 'last_version': data.version });
	});
});

function releaseNotes(){
    return '<p id="status"><h3 style="width: 500px">Changelog</h3><ul>' +
            '<li>Extension rewriten from scratch, please report any bug you find</li>' +
            '<li>New layout</li>' +
            '<li>Display in new window fully working with timing</li>' +
            '<li>Support for multiple lyrics provider (SUGGESTIONS ARE WELCOME)</li>' +
        '</ul><label>Note: A lot changed under the hood here, might take some time until all minor features (such as light and dark themes) gets implementes again. Please be patient.</label></p>';
}