function getDOMArtist(){
    return $("a[data-qa='mini_track_artist_name']:eq(0)").text();
}

function getDOMTrack(){
    return $("a[data-qa='mini_track_title']:eq(0)").text();
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
    return hmsToSecondsOnly($("span[data-qa='remaining_time']:eq(0)").text(), ':');
}

function getDOMTimeElapsedElement(){
    return $("span[data-qa='elapsed_time']:eq(0)");
}
