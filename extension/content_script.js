//Teste para saber se o jquery esta rodando
/*if (window.jQuery) {  
alert("OK");
} else {
alert("NOK");
}
*/

/* Esse javascript roda em background, eh a unica forma de acessar o conteudo da pagina.
 * Temos um listener que fica escutando as mensagens recebidas e tomando decisoes de acordo
*/

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){

	switch(message.query){
		case "getInfo":
			var currentSong;
			var currentArtist;
			var currentAlbum;
			var isPlaying;

			var hostname = $('<a>').prop('href', document.location).prop('hostname');

			if(hostname == "play.google.com"){
				currentSong = $('#playerSongTitle').text();
				currentArtist = $('#player-artist').text();
				currentAlbum = $('.player-album').text();
				isPlaying = (currentSong.trim().length>0 && currentArtist.trim().length>0)?true:false;
			}else if(hostname == "play.spotify.com"){
				currentArtist = $('#app-player').contents().find("#player").find("#track-artist").text();
				currentSong = $('#app-player').contents().find("#player").find("#track-name").text();
				currentAlbum = 'Unknown';
				isPlaying = (currentSong.trim().length>0 && currentArtist.trim().length>0)?true:false; 
			}else if(hostname.indexOf('deezer.com') > -1 ){
				currentArtist = $(".player-track-artist:eq(0) .player-track-link:eq(0)").text();
				currentSong = $(".player-track-title:eq(0)").text();
				currentAlbum = 'Unknown';
				isPlaying = (currentSong.trim().length>0 && currentArtist.trim().length>0)?true:false;
			}else if(hostname.indexOf('rdio.com') > -1 ){
				currentArtist = $(".drag_container:eq(0) .artist_title:eq(0)").text();
				currentSong = $(".drag_container:eq(0) .song_title:eq(0)").text();
				currentAlbum = 'Unknown';
				isPlaying = (currentSong.trim().length>0 && currentArtist.trim().length>0)?true:false;
			}else if(hostname.indexOf('grooveshark.com') > -1 ){
				currentArtist = $(".now-playing-link.artist:eq(0)").text();
				currentSong = $(".now-playing-link.song:eq(0)").text();
				currentAlbum = 'Unknown';
				isPlaying = (currentSong.trim().length>0 && currentArtist.trim().length>0)?true:false;
			}else if(hostname.indexOf('pandora.com') > -1 ){
				currentArtist = $(".playerBarArtist:eq(0)").text();
				currentSong = $(".playerBarSong:eq(0)").text();
				currentAlbum = $(".playerBarAlbum:eq(0)").text();
				isPlaying = (currentSong.trim().length>0 && currentArtist.trim().length>0)?true:false;
			}else if(hostname.indexOf('superplayer.fm') > -1 ){
				currentArtist = $("span[data-function='current-artist']").first().text();
				currentSong = $("span[data-function='current-track']").first().text();
				currentAlbum = 'Unknown';
				isPlaying = (currentSong.trim().length>0 && currentArtist.trim().length>0)?true:false;
			}else if(hostname.indexOf('youtube.com') > -1 ){
				var video_title = $("#eow-title").text();
				currentArtist = parseInfo(video_title).artist;
				currentSong = parseInfo(video_title).track;
				currentAlbum = 'Unknown';
				isPlaying = (document.getElementsByClassName("playing-mode").length > 0 )?true:false;
			}

            console.log(currentArtist+": "+currentSong+" ("+currentAlbum+")");
			var response = {isPlaying:isPlaying,
						currentSong:currentSong,
						currentArtist:currentArtist,
						currentAlbum:currentAlbum};
			sendResponse(response);
		break;

	}
});




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


