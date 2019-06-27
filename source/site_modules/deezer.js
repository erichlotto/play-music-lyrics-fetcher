function getDOMArtist(){
    return $(".marquee-content:eq(0) .track-link:eq(1)").first().text();
}

function getDOMTrack(){
    return $(".marquee-content:eq(0) .track-link:eq(0)").first().text();
}

function getDOMAlbum(){
    return 'Unknown';
}

function isDOMTrackAvailable(){
  return (getDOMArtist().length>0 && getDOMTrack().length>0)?true:false;
}

function getDOMTrackPosition(){
    var a = hmsToSecondsOnly($(".slider-counter.slider-counter-current").first().text(), ':');
    console.log(`getDOMTrackPosition=${a}`);
    return a;
}

function getDOMTrackDuration(){
    var a = hmsToSecondsOnly($(".slider-counter.slider-counter-max").first().text(), ':');
    console.log(`getDOMTrackDuration=${a}`);
    return a;
}

function getDOMTimeElapsedElement(){
   return $(".progress-time:eq(0)")
}
