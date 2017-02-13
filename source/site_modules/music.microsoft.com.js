function getDOMArtist(){
    return $(".playerNowPlayingMetadata:eq(1)>.secondaryMetadata>a").text();
}

function getDOMTrack(){
    return $(".playerNowPlayingMetadata:eq(1)>.primaryMetadata>a").text();
}

function getDOMAlbum(){
    return 'Unknown';
}

function isDOMTrackAvailable(){
  return (getDOMArtist().length>0 && getDOMTrack().length>0)?true:false;
}

function getDOMTrackPosition(){
    return hmsToSecondsOnly(getDOMTimeElapsedElement().text(), ':');
}

function getDOMTrackDuration(){
    return hmsToSecondsOnly($(".playerDurationTextRemaining").text(), ':');
}

function getDOMTimeElapsedElement(){
   return $(".playerDurationTextOnGoing");
}
