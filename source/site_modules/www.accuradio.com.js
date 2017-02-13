function getDOMArtist(){
    return $("#songartist").text();
}

function getDOMTrack(){
    return $("#songtitle").text();
}

function getDOMAlbum(){
    return $("#songalbum").text();
}

function isDOMTrackAvailable(){
  return (getDOMArtist().length>0 && getDOMTrack().length>0)?true:false;
}

function getDOMTrackPosition(){
    return hmsToSecondsOnly(getDOMTimeElapsedElement().text(), ':');
}

function getDOMTrackDuration(){
    var trackRemaining = hmsToSecondsOnly($("#durationLabel").text(), ':');
    return getDOMTrackPosition() + trackRemaining;
}

function getDOMTimeElapsedElement(){
   return $("#progressLabel");
}
