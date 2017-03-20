function getDOMArtist(){
    return $(".playing>.field-caption>.text-overflow:eq(1)").text();
}

function getDOMTrack(){
    return $(".playing>.field-caption>.text-overflow:eq(0)").text();
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
