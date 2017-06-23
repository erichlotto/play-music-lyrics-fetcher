var currentTrackInfo;
var lastLyricsEvent;
var checkForNewTrackInterval;
var checkTrackPositionInterval;
var delays = {};

/**
 * Check DOM for when a track changes
 */
function checkForNewTrack() {
//    log('CHECK FOR NEW TRACK');
    if (!isDOMTrackAvailable()) {
        onLyricsLoadError(null, null, "No song playing");
        console.log("No new track");
        return;
    }
    var newTrackInfo = getCurrentDOMTrackInfo();
    if (JSON.stringify(newTrackInfo) != JSON.stringify(currentTrackInfo)) {
        currentTrackInfo = newTrackInfo;
        if (!newTrackInfo.track) {
            onLyricsLoadError(null, null, "Unknown track");
        } else if (!newTrackInfo.artist) {
            onLyricsLoadError(null, null, "Unknown artist");
        } else {
            log("NEW TRACK: " + newTrackInfo.artist + " - " + newTrackInfo.track);
            getLyricsFromCache(newTrackInfo.artist, newTrackInfo.track);
        }
    }
}


/**
 * Dispatch an event informing the track's new position
 */
function checkTrackPosition() {
//    log('CHECK POSITION');
    var trackPosition = getCurrentDOMTrackPosition();
    if(trackPosition != undefined) {
        trackPosition.delay = delays[buildDelayId()] ? delays[buildDelayId()] : 0;
        dispatchEventToConnectedClients({query: "POSITION_CHANGED", position: trackPosition});
    }
}


/**
 * Dispatch avents about the lyrics
 */
function onLyricsLoadStart() {
    lastLyricsEvent = {query: "LYRICS_EVENT", status: "LOAD_START"};
    dispatchEventToConnectedClients(lastLyricsEvent);
}

function onLyricsLoadFinished(lyricsData, DOMArtist, DOMTrack) {
    storeLyricsInCache(lyricsData, DOMArtist, DOMTrack);
    lastLyricsEvent = {query: "LYRICS_EVENT", status: "LOAD_FINISH", lyrics: lyricsData, timmingSupport:(getCurrentDOMTrackPosition()!=undefined && getCurrentDOMTrackPosition().position!= -1) };
    dispatchEventToConnectedClients(lastLyricsEvent);
}

function onLyricsLoadError(DOMArtist, DOMTrack, message) {
    if(nextLyricsProviderExists()){
        // Try another lyric source
        fetchFromNextLyricsProvider(DOMArtist, DOMTrack);
    } else {
        lastLyricsEvent = {query: "LYRICS_EVENT", status: "LOAD_ERROR", error: message};
        dispatchEventToConnectedClients(lastLyricsEvent);
    }
}

function getLyricsFromCache(DOMArtist, DOMTrack) {
    chrome.storage.local.get(DOMArtist + DOMTrack, function (obj) {
        if (obj[DOMArtist + DOMTrack]) {
            // log("CACHED LYRICS FOUND");
            onLyricsLoadFinished(obj[DOMArtist + DOMTrack]);
        } else {
            // log("CACHED LYRICS NOT FOUND");
            fetchFromFirstLyricsProvider(DOMArtist, DOMTrack);
        }
    });
}

function storeLyricsInCache(lyricsData, DOMArtist, DOMTrack) {
    // cache write
    var cachedObj = {}
    cachedObj[DOMArtist + DOMTrack] = lyricsData;
    chrome.storage.local.set(cachedObj);
    // log("LYRIC STORED ON CACHE");
}


/**
 * Return a string representing an id for the current track. Try to be as unique as possible.
 */
function buildDelayId(){
    return document.location + JSON.stringify(currentTrackInfo);
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
                        chrome.storage.sync.get('timedLyrics', function(obj) {
                            lastLyricsEvent.timmingSupport = (getCurrentDOMTrackPosition()!=undefined && getCurrentDOMTrackPosition().position!= -1 && obj.timedLyrics!=false);
                            dispatchEventToConnectedClients(lastLyricsEvent);
                        });
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
                    delays[buildDelayId()] = message.delay;
                    checkTrackPosition();
                    break;
                case 'SEARCH':
                    getLyricsFromCache(message.artist, message.track);
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
