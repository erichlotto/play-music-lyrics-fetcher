var timeOnLastFullSecond = -1;


/**
 * Return info about the currently playing track
 */
function getCurrentDOMTrackInfo() {
    if (isSiteModuleConsistent()) {
        return {
            "artist": getDOMArtist(),
            "track": getDOMTrack(),
            "album": getDOMAlbum()
        }
    }
}


/**
 * Return the position of the currently playing track
 */
function getCurrentDOMTrackPosition() {
  if(!isDOMTrackAvailable()){
    return {
        "position": -1,
        "duration": -1
    }
  }
    var duration = getDOMTrackDuration();
    if (isSiteModuleConsistent()) {
        return {
            "position": getPositionWithDecimal(),
            "duration": duration && duration > 0 ? duration : -1
        }
    }
}


/**
 * We need to create a pseudo-current position to get decimal value
 */
function getPositionWithDecimal() {
    var trackPosition = getDOMTrackPosition();
    // if the page does not provide position, we return -1;
    if(trackPosition == undefined || trackPosition.length <1){
        return -1;
    }
    if(timeOnLastFullSecond == -1){
        listenForElementUpdate();
    }
    if (isInt(trackPosition)) {
        var extraTime = (new Date().getTime() - timeOnLastFullSecond) / 1000;
        if (extraTime > 1) {
            extraTime = 1;
        }
        if (trackPosition != -1) {
            trackPosition += extraTime;
        }
    }
    return trackPosition ? trackPosition : getDOMTrackPosition();
}


/**
 * Listener for elements updated on screen
 */
function listenForElementUpdate() {
    //Time elapsed is needed to create a decimal support
    var timeElapsedElement = getDOMTimeElapsedElement();
    if (timeElapsedElement != undefined) {
        timeElapsedElement.unbind('DOMSubtreeModified');
        timeElapsedElement.bind("DOMSubtreeModified", function () {
            timeOnLastFullSecond = new Date().getTime();
        });
    }
}


/**
 * Check if functions were properly declared in current site module before accessing them
 */
function isSiteModuleConsistent() {
    try {
        getDOMArtist();
        getDOMTrack();
        getDOMAlbum();
        getDOMTrackPosition();
        getDOMTrackDuration();
        isDOMTrackAvailable();
        getDOMTimeElapsedElement();
        return true;
    } catch (err) {
        log(err);
        return false;
    }
}
