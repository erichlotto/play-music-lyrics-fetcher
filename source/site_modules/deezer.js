function getDOMArtist(){
    return $(".player-track-artist:eq(0) .player-track-link:eq(0)").text();
}

function getDOMTrack(){
    return $(".player-track-title:eq(0)").text();
}

function getDOMAlbum(){
    return 'Unknown';
}

function isDOMTrackAvailable(){
  return (getDOMArtist().length>0 && getDOMTrack().length>0)?true:false;
}

function getDOMTrackPosition(){
    return hmsToSecondsOnly($(".progress-time:eq(0)").text(), ':');
}

function getDOMTrackDuration(){
    return hmsToSecondsOnly($(".progress-length:eq(0)").text(), ':');
}

function getDOMTimeElapsedElement(){
   return $(".progress-time:eq(0)")
}
