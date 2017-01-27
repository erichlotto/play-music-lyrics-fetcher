var lyricsFetchTries = [];

function fetchLyrics(domArtist, domTrack) {
    onLyricsLoadStart();
    if (!lyricsFetchTries[domArtist + domTrack])
        lyricsFetchTries[domArtist + domTrack] = 0;
    lyricsFetchTries[domArtist + domTrack]++;

    var url = "https://api.vagalume.com.br/search.php"
        + "?art=" + encodeURIComponent(domArtist)
        + "&mus=" + encodeURIComponent(domTrack)
        + "&apikey=660a4395f992ff67786584e238f501aa";

    // Check if browser supports CORS - http://www.w3.org/TR/cors/
    if (!jQuery.support.cors) {
        url += "&callback=?";
    }

    log("Fetching lyrics for \"" + domArtist + "\" > \"" + domTrack + "\" ...");

    jQuery.getJSON(url, function (data) {
        //Continue
        validateLyrics(data, domArtist, domTrack);
    }).fail(function (err) {
        // Something went wrong with the request. Alert the user
        onLyricsLoadError("There was an error trying to reach the API");
        console.log(err);
    });

}

function validateLyrics(data, domArtist, domTrack) {

    if (data.type == 'exact' || data.type == 'aprox') {
        if (!data.mus[0].text) {
            //todo No lyrics found for this song. Is it instrumental?
            data.mus[0].text = "No lyrics found for this song. Is it instrumental?";
        }

        if (getCurrentDOMTrackPosition().position != -1)
            fetchTiming(domArtist, domTrack, data);
        else
            showLyrics(domArtist, domTrack, data);

    } else if (lyricsFetchTries[domArtist + domTrack] < 3) {
        fetchLyrics(domTrack, domArtist);
    } else if (data.type == 'song_notfound') {
        // Song not found, but artist was found
        onLyricsLoadError("We could not find song " + domTrack + " by " + data.art.name);
    } else {
        // Artist not found
        onLyricsLoadError("We could not find artist " + domArtist);
    }
}

function fetchTiming(domArtist, domTrack, trackData) {

    var url = "https://app2.vagalume.com.br/ajax/subtitle-get.php?action=getBestSubtitle"
        + "&pointerID=" + trackData.mus[0].id
        + "&duration=" + getCurrentDOMTrackPosition().duration;

    // Check if browser supports CORS - http://www.w3.org/TR/cors/
    if (!jQuery.support.cors) {
        url += "&callback=?";
    }

    log("Fetching timing...");
    jQuery.getJSON(url, function (timingData) {
        //Continue
        validateTiming(domArtist, domTrack, trackData, timingData);
    }).fail(function (err) {
        // Something went wrong with the request. Alert the user
        onLyricsLoadError("There was an error trying to reach the API");
        console.log(err);
    });
}

function validateTiming(domArtist, domTrack, trackData, timingData) {
    if (timingData.subtitles) {
        showLyrics(domArtist, domTrack, trackData, timingData);
    } else {
        // Subtitle not found
        log("Timing not found");
        showLyrics(domArtist, domTrack, trackData);
    }
}

function showLyrics(domArtist, domTrack, trackData, timingData) {
    var static;
    var timmed = [];
    try {
        static = trackData.mus[0].text
        for (i in timingData.subtitles[0].text_compressed) {
            var current_line = timingData.subtitles[0].text_compressed[i];

            // Prevent duplicated sentences display
            if(timmed.length == 0 ||
                current_line[0] != timmed[timmed.length-1].text ||
                current_line[1] > timmed[timmed.length-1].enter + 0.5) {
                timmed.push({
                    "text": current_line[0],
                    "enter": current_line[1],
                    "exit": current_line[2]
                });
            }
        }
    } catch (err) {
    }
    onLyricsLoadFinished({
        "artist": trackData.art.name,
        "track": trackData.mus[0].name,
        "static": static,
        "timmed": timmed
    }, domArtist, domTrack);
}
