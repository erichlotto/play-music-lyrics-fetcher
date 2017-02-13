function getDOMArtist(){
    return $("strong[data-value='artist']").first().text()
}

function getDOMTrack(){
    return $("span[data-value='name']").first().text()
}

function getDOMAlbum(){
    return 'Unknown';
}

function isDOMTrackAvailable(){
  return (getDOMArtist().length>0 && getDOMTrack().length>0)?true:false;
}

function getDOMTrackPosition(){
    return hmsToSecondsOnly($("span[data-value='currentTime']").first().text(), ':');
}

function getDOMTrackDuration(){
    return hmsToSecondsOnly($("span[data-value='duration']").first().text(), ':');
}

function getDOMTimeElapsedElement(){
   return $("span[data-value='currentTime']").first();
}
