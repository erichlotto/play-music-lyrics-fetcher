/**
 * lyric_providers should have following methods:
 *
 * fetchLyrics(ARTIST (string), TRACK (string));
 *
 * onLyricsLoadFinished({
 *       "artist": "Metallica",
 *       "track": "One",
 *       "static": "Lyrics in static format, as a string",
 *       "timmed": [{
 *                   "text": "Line 1",
 *                   "enter": 12.3,
 *                   "exit": 13.1
 *               },
 *               {
 *                   "text": "Line 2",
 *                   "enter": 17.3,
 *                   "exit": 18.7
 *               }]
 *   }, "Artist name as seen in DOM", "Artist track as seen in DOM");
 */
var lyricsFetchTries = [];

function fetchLyrics(DOMArtist, DOMTrack) {
    if (!lyricsFetchTries[DOMArtist + DOMTrack])
        lyricsFetchTries[DOMArtist + DOMTrack] = 0;
    lyricsFetchTries[DOMArtist + DOMTrack]++;

    var url = "https://api.vagalume.com.br/search.php"
        + "?art=" + encodeURIComponent(DOMArtist)
        + "&mus=" + encodeURIComponent(DOMTrack)
        + "&apikey=" + VAGALUME_API_KEY;

    // Check if browser supports CORS - http://www.w3.org/TR/cors/
    if (!jQuery.support.cors) {
        url += "&callback=?";
    }

    jQuery.getJSON(url, function (data) {
        //Continue
        validateLyrics(data, DOMArtist, DOMTrack);
    }).fail(function (err) {
        // Something went wrong with the request. Alert the user
        onLyricsLoadError(DOMArtist, DOMTrack, "There was an error trying to reach the API");
        console.log(err);
    });

}

function validateLyrics(data, DOMArtist, DOMTrack) {

    if (data.type == 'exact' || data.type == 'aprox') {
        if (!data.mus[0].text) {
            //todo No lyrics found for this song. Is it instrumental?
            data.mus[0].text = "No lyrics found for this song. Is it instrumental?";
        }

        fetchTiming(DOMArtist, DOMTrack, data);

    } else if (lyricsFetchTries[DOMArtist + DOMTrack] < 3) {
        fetchLyrics(DOMTrack, DOMArtist);
    } else if (data.type == 'song_notfound') {
        // Song not found, but artist was found
        onLyricsLoadError(DOMArtist, DOMTrack, "We could not find song " + DOMTrack + " by " + data.art.name);
    } else {
        // Artist not found
        onLyricsLoadError(DOMArtist, DOMTrack, "We could not find artist " + DOMArtist);
    }
}

function fetchTiming(DOMArtist, DOMTrack, trackData) {

    var url = "https://app2.vagalume.com.br/ajax/subtitle-get.php?action=getBestSubtitle"
        + "&pointerID=" + trackData.mus[0].id
        + "&duration=" + getCurrentDOMTrackPosition().duration;

    // Check if browser supports CORS - http://www.w3.org/TR/cors/
    if (!jQuery.support.cors) {
        url += "&callback=?";
    }
    jQuery.getJSON(url, function (timingData) {
        //Continue
        validateTiming(DOMArtist, DOMTrack, trackData, timingData);
    }).fail(function (err) {
        // Something went wrong with the request. Alert the user
        onLyricsLoadError(DOMArtist, DOMTrack, "There was an error trying to reach the API");
        console.log(err);
    });
}

function validateTiming(DOMArtist, DOMTrack, trackData, timingData) {
    if (timingData.subtitles) {
        showLyrics(DOMArtist, DOMTrack, trackData, timingData);
    } else {
        // Subtitle not found
        showLyrics(DOMArtist, DOMTrack, trackData);
    }
}

function showLyrics(DOMArtist, DOMTrack, trackData, timingData) {
    var static;
    var timmed = [];

    var engSubtitleIndex = -1;
    if(timingData && timingData.subtitles){
        for (i in timingData.subtitles) {
            if (timingData.subtitles[i].lID == 2) {
                engSubtitleIndex = i;
            }
        }
        if(engSubtitleIndex == -1 && timingData.subtitles.length > 0){
            engSubtitleIndex = 0;
        }
    }
    try {
        static = trackData.mus[0].text
        if (engSubtitleIndex > -1) {
            for (i in timingData.subtitles[engSubtitleIndex].text_compressed) {
                var current_line = timingData.subtitles[engSubtitleIndex].text_compressed[i];

                // Prevent duplicated sentences display
                if (timmed.length == 0 ||
                    current_line[0] != timmed[timmed.length - 1].text ||
                    current_line[1] > timmed[timmed.length - 1].enter + 0.5) {
                    timmed.push({
                        "text": current_line[0],
                        "enter": current_line[1],
                        "exit": current_line[2]
                    });
                }
            }
        }
    } catch (err) {
    }
    onLyricsLoadFinished({
        "artist": trackData.art.name,
        "track": trackData.mus[0].name,
        "static": static,
        "timmed": timmed
    }, DOMArtist, DOMTrack);
}
