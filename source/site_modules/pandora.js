function getDOMArtist(){
    return $(".playerBarArtist:eq(0)").text();
}

function getDOMTrack(){
    return $(".playerBarSong:eq(0)").text();
}

function getDOMAlbum(){
    return $(".playerBarAlbum:eq(0)").text();
}

function isDOMTrackAvailable(){
  return (getDOMArtist().length>0 && getDOMTrack().length>0)?true:false;
}

function getDOMTrackPosition(){
    return hmsToSecondsOnly($(".elapsedTime:eq(0)").text(), ':');
}

function getDOMTrackDuration(){
    var trackRemaining = hmsToSecondsOnly($(".remainingTime:eq(0)").text(), ':');
    return getDOMTrackPosition() + trackRemaining;
}

function getDOMTimeElapsedElement(){
   return $(".elapsedTime:eq(0)");
}
