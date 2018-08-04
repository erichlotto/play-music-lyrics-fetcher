/*
 * Note: since release 1.0.13 we no longer use ADD_REQUEST_LISTENER to listen
 * for the track position on Spotify. Legacy code is commented for future
 * reference.
 */
function getDOMArtist(){
    return $('#player-track-artist').text().trim();
}

function getDOMTrack(){
    return $('#player-track-name').text().trim();
}

function getDOMAlbum(){
    return 'Unknown';
}

function isDOMTrackAvailable(){
  return (getDOMArtist().length>0 && getDOMTrack().length>0)?true:false;
}

function getDOMTrackPosition(){
    return hmsToSecondsOnly(getDOMTimeElapsedElement().text().trim(), ":");
    // var $elm = $(".now-playing-bar div:not(.extra-controls) .progress-bar__fg");
    // var percentage = $elm.width() / $elm.parent().width();
    // return trackDuration * percentage;
}

function getDOMTrackDuration(){
    return hmsToSecondsOnly($('#player-duration').text().trim(), ":");
    // return trackDuration;
}

function getDOMTimeElapsedElement(){
    return $('#player-time-elpased');
    // return undefined;
}

// var callback = "REQUEST_RECEIVED";
// var trackDuration = -1;
//
// chrome.runtime.sendMessage({query: 'ADD_REQUEST_LISTENER', url: "https://spclient.wg.spotify.com/track-playback/*", response:callback });
//
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
// switch(request.query) {
//     case callback:
//         if(request.body.sub_state != undefined && request.body.sub_state.duration != undefined){
//             trackDuration = request.body.sub_state.duration / 1000;
//             console.log('hey');
//         }
//         break;
// }});
