function fetchLyrics(DOMArtist, DOMTrack) {

    var url = "http://www.metrolyrics.com/" + DOMTrack.toLowerCase().replace(/ /g, "-") + "-lyrics-" + DOMArtist.toLowerCase().replace(/ /g, "-") + ".html";

    chrome.runtime.sendMessage({query: 'MAKE_INSECURE_REQUEST', url: url}, function (response) {
        if (response.error == undefined) {
            //SUCCESS
            var html = $($.parseHTML(response.content));
            var rawlyrics = html.find(".verse");
            var lyrics = "";
            for (var i = 0; i < rawlyrics.length; i++) {
                lyrics += (i > 0 ? "\n\n" : "") + $(rawlyrics[i]).text();
            }

            var artist = html.find("h2").text().split("Lyrics")[0];
            var track = html.find("h1").text().split("Lyrics")[0];
            var response = {
                "artist": artist.trim(),
                "track": track.trim(),
                "static": lyrics.trim()
            };

            if(response != undefined &&
                response.artist != undefined && response.artist.trim().length > 0 &&
                response.track != undefined && response.track.trim().length > 0 &&
                response.static != undefined && response.static.trim().length > 0) {
                onLyricsLoadFinished(response, DOMArtist, DOMTrack);
            } else {
                onLyricsLoadError(DOMArtist, DOMTrack, "No lyrics found for " + toTitleCase(DOMTrack) + " by " + toTitleCase(DOMArtist));
            }

        } else {
            onLyricsLoadError(DOMArtist, DOMTrack, "No lyrics found for " + toTitleCase(DOMTrack) + " by " + toTitleCase(DOMArtist));
        }
    });
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
