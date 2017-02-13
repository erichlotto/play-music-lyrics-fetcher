function getDOMArtist(){
    console.log($('.player__text div[data-bind="artist"]>a').first().text());
    return $('.player__text div[data-bind="artist"]>a').first().text();
}

function getDOMTrack(){
    return $('.player__text a[data-bind="title"]').text();
}

function getDOMAlbum(){
    return $('td[data-bind="album"]>a').text();
}

function isDOMTrackAvailable(){
  return (getDOMArtist().length>0 && getDOMTrack().length>0)?true:false;
}

function getDOMTrackPosition(){
    var pos = $(".ui-slider-range").width();
    var total = $('.ui-slider-range').parent().width();
    var trackRelativePosition = pos/total;
    return getDOMTrackDuration() * trackRelativePosition
}

function getDOMTrackDuration(){
    return hmsToSecondsOnly($("span.progress-duration").text(), ':');
}

function getDOMTimeElapsedElement(){
   return $("span.progress-progress");
}
