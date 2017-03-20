function getDOMArtist(){
    return $('.metadata>p.artist>a').text();
}

function getDOMTrack(){
    return $('.metadata>p.headline-support>a').text();
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
    return hmsToSecondsOnly($("#progressContainer>span:eq(1)").text(), ':');
}

function getDOMTimeElapsedElement(){
   return $("#progressContainer>span:eq(0)");
}
