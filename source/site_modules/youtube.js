function getDOMArtist(){
    return parseInfo(getDOMArtistTrackElement().text()).artist.trim();
}

function getDOMTrack(){
    return parseInfo(getDOMArtistTrackElement().text()).track.trim();
}

function getDOMAlbum(){
    return 'Unknown';
}

function isDOMTrackAvailable(){
  return getDOMArtistTrackElement().length;
}

function getDOMTrackPosition(){
    var trackPosition = -1;
    try{
      trackPosition = Math.round($("video.video-stream.html5-main-video:eq(0)")["0"]["currentTime"]);
      if(!trackPosition){
         trackPosition = hmsToSecondsOnly(getDOMTimeElapsedElement().text(), ':');
      }
    } catch (err){}
    return trackPosition
}

function getDOMTrackDuration(){
    var trackLength = -1;
    try{
      trackLength = Math.round($("video.video-stream.html5-main-video:eq(0)")["0"]["duration"]);
    	if(!trackLength){
         trackLength = hmsToSecondsOnly($(".ytp-time-duration:eq(0)").text(), ':');
      }
    } catch(err){}
    return trackLength;
}

function getDOMTimeElapsedElement(){
   return $(".ytp-time-current:eq(0)");
}

function getDOMArtistTrackElement(){
  if($("#eow-title").length){
    return $("#eow-title");
  } else if($("h1.title").length){// new layout
    return $("h1.title");
  }

}


/*

The following methods are required to parse youtube info.

Kindly stolen from David Sabata's Web Scroller:
https://github.com/david-sabata/web-scrobbler

*/

/**
 * Parse given string into artist and track, assume common order Art - Ttl
 * @return {artist, track}
 */
function parseInfo(artistTitle) {
   var artist = '';
   var track = '';

   var separator = findSeparator(artistTitle);
   if (separator == null)
      return { artist: '', track: '' };

   artist = artistTitle.substr(0, separator.index);
   track = artistTitle.substr(separator.index + separator.length);

   return cleanArtistTrack(artist, track);
}

function findSeparator(str) {
   // care - minus vs hyphen
   var separators = [' - ', ' – ', '-', '–', ':'];

   for (i in separators) {
      var sep = separators[i];
      var index = str.indexOf(sep);
      if (index > -1)
         return { index: index, length: sep.length };
   }

   return null;
}

/**
 * Clean non-informative garbage from title
 */
function cleanArtistTrack(artist, track) {

   // Do some cleanup
   artist = artist.replace(/^\s+|\s+$/g,'');
   track = track.replace(/^\s+|\s+$/g,'');

   // Strip crap
   track = track.replace(/\s*\*+\s?\S+\s?\*+$/, ''); // **NEW**
   track = track.replace(/\s*\[[^\]]+\]$/, ''); // [whatever]
   track = track.replace(/\s*\([^\)]*version\)$/i, ''); // (whatever version)
   track = track.replace(/\s*\.(avi|wmv|mpg|mpeg|flv)$/i, ''); // video extensions
   track = track.replace(/\s*(LYRIC VIDEO\s*)?(lyric video\s*)/i, ''); // (LYRIC VIDEO)
   track = track.replace(/\s*(Official Track Stream*)/i, ''); // (Official Track Stream)
   track = track.replace(/\s*(of+icial\s*)?(music\s*)?video/i, ''); // (official)? (music)? video
   track = track.replace(/\s*(of+icial\s*)?(music\s*)?audio/i, ''); // (official)? (music)? audio
   track = track.replace(/\s*(ALBUM TRACK\s*)?(album track\s*)/i, ''); // (ALBUM TRACK)
   track = track.replace(/\s*(COVER ART\s*)?(Cover Art\s*)/i, ''); // (Cover Art)
   track = track.replace(/\s*\(\s*of+icial\s*\)/i, ''); // (official)
   track = track.replace(/\s*\(\s*[0-9]{4}\s*\)/i, ''); // (1999)
   track = track.replace(/\s+\(\s*(HD|HQ)\s*\)$/, ''); // HD (HQ)
   track = track.replace(/\s+(HD|HQ)\s*$/, ''); // HD (HQ)
   track = track.replace(/\s*video\s*clip/i, ''); // video clip
   track = track.replace(/\s+\(?live\)?$/i, ''); // live
   track = track.replace(/\(+\s*\)+/, ''); // Leftovers after e.g. (official video)
   track = track.replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2'); // Artist - The new "Track title" featuring someone
   track = track.replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2'); // 'Track title'
   track = track.replace(/^[\/\s,:;~-\s"]+/, ''); // trim starting white chars and dash
   track = track.replace(/[\/\s,:;~-\s"\s!]+$/, ''); // trim trailing white chars and dash
   //" and ! added because some track names end as {"Some Track" Official Music Video!} and it becomes {"Some Track"!} example: http://www.youtube.com/watch?v=xj_mHi7zeRQ

   return {artist: artist, track: track};
}
