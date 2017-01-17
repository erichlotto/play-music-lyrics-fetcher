function getDOMArtist(){
    return $('#player-artist').text().trim();
}

function getDOMTrack(){
    var currentSong = $('#currently-playing-title').text();
	if(!currentSong)currentSong = $('#player-song-title').text(); //Old layout
	if(!currentSong)currentSong = $('#playerSongTitle').text(); //Even older layout
    return currentSong.trim();
}

function getDOMAlbum(){
    return $('.player-album').text();
}

function isDOMTrackAvailable(){
  return (getDOMArtist().length>0 && getDOMTrack().length>0)?true:false;
}

function getDOMTrackPosition(){
    return hmsToSecondsOnly(getDOMTimeElapsedElement().text(), ':');
}

function getDOMTrackDuration(){
    return hmsToSecondsOnly($("#time_container_duration").text(), ':');
}

function getDOMTimeElapsedElement(){
   return $("#time_container_current");
}
