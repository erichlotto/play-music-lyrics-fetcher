function fetchLyrics(DOMArtist, DOMTrack){
    var url = "https://api.genius.com/search?access_token=" + GENIUS_ACCESS_TOKEN + "&q=" + DOMArtist + "%20" + DOMTrack + "&per_page=1";
    jQuery.getJSON(url, function(data) {
        loadLyricsPage(DOMArtist, DOMTrack, data.response.hits[0]);
    }).fail(function(err) {
        // Something went wrong with the request. Alert the user
            onLyricsLoadError(DOMArtist, DOMTrack, "No lyrics found for " + DOMTrack + " by " + DOMArtist);
        console.log(err);
    });
}

function loadLyricsPage(DOMArtist, DOMTrack, hit){
    // we only display the result if it's the correct match
    if(hit && hit.result.title.toLowerCase() == DOMTrack.toLowerCase() && hit.result.primary_artist.name.toLowerCase() == DOMArtist.toLowerCase()) {
        $.get(hit.result.url, function (data) {
            var html = $($.parseHTML(data));

            var artist = hit.result.primary_artist && hit.result.primary_artist.name;
            var track = hit.result.title;
            var lyrics = html.find(".lyrics").text().replace(/(\[.+\])/g, '');
            var response = {
                "artist": artist,
                "track": track,
                "static": lyrics.trim()
            };

            onLyricsLoadFinished(response, DOMArtist, DOMTrack);

        }).fail(function (err) {
            // Something went wrong with the request. Alert the user
            onLyricsLoadError(DOMArtist, DOMTrack, "No lyrics found for " + DOMTrack + " by " + DOMArtist);
        });
    } else {
            onLyricsLoadError(DOMArtist, DOMTrack, "No lyrics found for " + DOMTrack + " by " + DOMArtist);
    }
}


