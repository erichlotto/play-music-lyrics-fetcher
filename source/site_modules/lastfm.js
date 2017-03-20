function getDOMArtist(){
    return $('.player-bar-artist-name').text();
}

function getDOMTrack(){
    return $('.player-bar-track-name').text();
}

function getDOMAlbum(){
    return 'Unknown';
}

function isDOMTrackAvailable(){
  return (getDOMArtist().length>0 && getDOMTrack().length>0)?true:false;
}

function getDOMTrackPosition(){
    return -1;
}

function getDOMTrackDuration(){
    return -1;
}

function getDOMTimeElapsedElement(){
   return undefined;
}
