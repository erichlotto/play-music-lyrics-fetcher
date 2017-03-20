function getDOMArtist(){
    return $('.now-playing-bar > div:eq(0) > div:eq(0) > div:eq(1)').text().trim().split(",")[0];
}

function getDOMTrack(){
    return $('.now-playing-bar > div:eq(0) > div:eq(0) > div:eq(0)').text().trim();
}

function getDOMAlbum(){
    return 'Unknown';
}

function isDOMTrackAvailable(){
  return (getDOMArtist().length>0 && getDOMTrack().length>0)?true:false;
}

function getDOMTrackPosition(){
    var $elm = $(".now-playing-bar div:not(.extra-controls) .progress-bar__fg");
    var percentage = $elm.width() / $elm.parent().width();
    return trackDuration * percentage;
}

function getDOMTrackDuration(){
    return trackDuration;
}

function getDOMTimeElapsedElement(){
    return undefined;
}

var callback = "REQUEST_RECEIVED";
var trackDuration = -1;

chrome.runtime.sendMessage({query: 'ADD_REQUEST_LISTENER', url: "https://spclient.wg.spotify.com/track-playback/*", response:callback });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
switch(request.query) {
    case callback:
        if(request.body.sub_state != undefined && request.body.sub_state.duration != undefined){
            trackDuration = request.body.sub_state.duration / 1000;
        }
        break;
}});
