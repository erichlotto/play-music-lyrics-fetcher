var currentTrackInfo;
var lastLyricsEvent;
var checkForNewTrackInterval;
var checkTrackPositionInterval;



// var siteModulePath = 'site_modules/' + document.location.hostname + '.js';
// $.get(chrome.extension.getURL(siteModulePath), null, null, "text")
//     .done(function () {
//         // URL IS SUPPORTED! (site module found)
//         chrome.runtime.sendMessage({query: 'SHOW_PAGE_ACTION', path: siteModulePath});
//     })
//     .error(function(e){
//         console.log(e);
//     });


/**
 * Check DOM for when a track changes
 */
function checkForNewTrack() {
    log('CHECK FOR NEW TRACK');
    if (!isDOMTrackAvailable()) {
        onLyricsLoadError("No song playing");
        return;
    }
    var newTrackInfo = getCurrentDOMTrackInfo();
    if (JSON.stringify(newTrackInfo) != JSON.stringify(currentTrackInfo)) {
        if (!newTrackInfo.track) {
            onLyricsLoadError("Unknown track");
        } else if (!newTrackInfo.artist) {
            onLyricsLoadError("Unknown artist");
        } else {
            log("NEW TRACK: " + newTrackInfo.artist + " - " + newTrackInfo.track);
            getLyricsFromCache(newTrackInfo.artist, newTrackInfo.track);
            currentTrackInfo = newTrackInfo;
        }
    }
}


/**
 * Dispatch an event informing the track's new position
 */
function checkTrackPosition() {
    log('CHECK POSITION');
    var trackPosition = getCurrentDOMTrackPosition();
    chrome.runtime.sendMessage({query: "POSITION_CHANGED", position: trackPosition});
}


/**
 * Dispatch avents about the lyrics
 */
function onLyricsLoadStart() {
    lastLyricsEvent = {query: "LYRICS_EVENT", status: "LOAD_START"};
    chrome.runtime.sendMessage(lastLyricsEvent);
}

function onLyricsLoadFinished(lyricsData, artist, track) {
    storeLyricsInCache(lyricsData, artist, track);
    lastLyricsEvent = {query: "LYRICS_EVENT", status: "LOAD_FINISH", lyrics: lyricsData};
    chrome.runtime.sendMessage(lastLyricsEvent);
}

function onLyricsLoadError(message) {
    lastLyricsEvent = {query: "LYRICS_EVENT", status: "LOAD_ERROR", error: message};
    chrome.runtime.sendMessage(lastLyricsEvent);
}

function getLyricsFromCache(domArtist, domTrack) {
    chrome.storage.local.get(domArtist + domTrack, function (obj) {
        if (obj[domArtist + domTrack]) {
            log("CACHED LYRICS FOUND");
            console.log(obj);
            onLyricsLoadFinished(obj[domArtist + domTrack]);
        } else {
            log("CACHED LYRICS NOT FOUND");
            fetchLyrics(domArtist, domTrack);
        }
    });
}

function storeLyricsInCache(lyricsData, domArtist, domTrack) {
    // cache write
    var cachedObj = {}
    cachedObj[domArtist + domTrack] = lyricsData;
    chrome.storage.local.set(cachedObj);
    log("LYRIC STORED ON CACHE");
}


/* MESSAGE LISTENERS */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.query) {
        case 'INFO_REQUEST':
            if (lastLyricsEvent) {
                chrome.runtime.sendMessage(lastLyricsEvent);
            } else {
                onLyricsLoadStart();
            }
            checkForNewTrack();
            break;
        case 'ACTIVE_LISTENER_FLAG':
            if (message.someoneListening) {
                checkForNewTrackInterval = setInterval(checkForNewTrack, 500);
                checkTrackPositionInterval = setInterval(checkTrackPosition, 200);
            } else {
                clearInterval(checkForNewTrackInterval);
                clearInterval(checkTrackPositionInterval);
            }
            break;
    }
});
