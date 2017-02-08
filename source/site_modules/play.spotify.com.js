// OLD LAYOUT

function getDOMArtist(){
    return $('#app-player').contents().find("#player").find("#track-artist").text();
}

function getDOMTrack(){
    return $('#app-player').contents().find("#player").find("#track-name").text();
}

function getDOMAlbum(){
    return 'Unknown';
}

function isDOMTrackAvailable(){
  return (getDOMArtist().length>0 && getDOMTrack().length>0)?true:false;
}

function getDOMTrackPosition(){
    return hmsToSecondsOnly($('#app-player').contents().find("#progress").find("#track-current").text(), ':');
}

function getDOMTrackDuration(){
    return hmsToSecondsOnly($('#app-player').contents().find("#progress").find("#track-length").text(), ':');
}

function getDOMTimeElapsedElement(){
   return $('#app-player').contents().find("#progress").find("#track-current");
}
