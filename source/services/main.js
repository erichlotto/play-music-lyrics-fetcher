var currentTrackInfo;
var lastLyricsEvent;
var checkForNewTrackInterval;
var checkTrackPositionInterval;
var currentTrackDelay = 0;

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
        currentTrackDelay = 0;
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
    trackPosition.delay = currentTrackDelay;
    dispatchEventToConnectedClients({query: "POSITION_CHANGED", position: trackPosition});
}


/**
 * Dispatch avents about the lyrics
 */
function onLyricsLoadStart() {
    lastLyricsEvent = {query: "LYRICS_EVENT", status: "LOAD_START"};
    dispatchEventToConnectedClients(lastLyricsEvent);
}

function onLyricsLoadFinished(lyricsData, artist, track) {
    storeLyricsInCache(lyricsData, artist, track);
    lastLyricsEvent = {query: "LYRICS_EVENT", status: "LOAD_FINISH", lyrics: lyricsData};
    dispatchEventToConnectedClients(lastLyricsEvent);
}

function onLyricsLoadError(message) {
    lastLyricsEvent = {query: "LYRICS_EVENT", status: "LOAD_ERROR", error: message};
    dispatchEventToConnectedClients(lastLyricsEvent);
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




/**
 * MESSAGE LISTENERS
 */


var windowId = -1; // Keep track of the currently open popup window, so we can just switch focus instead of creating a new one
var clients = []; // Keep track of every client listening to this tab

function dispatchEventToConnectedClients(event){
    for(i in clients){
        clients[i].postMessage(event);
    }
}
chrome.runtime.onConnect.addListener(function(client) {
    if(client.name.includes("visualizer")) {
        clients.push(client);
        if(clients.length == 1) {
            checkForNewTrackInterval = setInterval(checkForNewTrack, 500);
            checkTrackPositionInterval = setInterval(checkTrackPosition, 200);
        }
        client.onMessage.addListener(function (message) {
            switch (message.query) {
                case 'INFO_REQUEST':
                    if (lastLyricsEvent) {
                        dispatchEventToConnectedClients(lastLyricsEvent);
                    } else {
                        onLyricsLoadStart();
                    }
                    checkForNewTrack();
                    break;
                case 'WINDOW_OPEN':
                    windowId = message.windowId;
                    break;
                case 'OPEN_POPUP_WINDOW':
                    client.postMessage({query:"OPEN_POPUP_WINDOW", windowId:windowId})
                    break;
                case 'SET_DELAY':
                    currentTrackDelay = message.delay;
                    break;
            }
        });
        client.onDisconnect.addListener(function(port){
            for(i in clients){
                if(clients[i].name == port.name){
                    clients.splice(i, 1);
                }
            }
            if(clients.length == 0){
                clearInterval(checkForNewTrackInterval);
                clearInterval(checkTrackPositionInterval);
            }
        });
    }
});
