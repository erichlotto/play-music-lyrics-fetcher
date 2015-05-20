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


// delay and artistData are variables to store current song's delay
var delay;
var localArtistTrack;
var timeOnLastFullSecond;

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){

	switch(message.query){
		case "getInfo":
			var response = getSongInfo();
            console.log('===============\n___Artist : '+response.currentArtist+
						"\n____Track : "+response.currentSong+
						"\n____Album : "+response.currentAlbum+
						"\nisPlaying : "+response.isPlaying+
						"\n================");

			var timeElapsedElement = getTimeElapsedElement();

			if(timeElapsedElement!=null){
				timeElapsedElement.unbind('DOMSubtreeModified');
				timeElapsedElement.bind("DOMSubtreeModified",function(){
					timeOnLastFullSecond = new Date().getTime();
				});
			}
			sendResponse(response);
		break;
		case "getPosition":
			var trackPosition=0;
			var trackLength=0;

			var hostname = $('<a>').prop('href', document.location).prop('hostname');
			try{
				if(hostname == "play.google.com"){
					trackPosition = hmsToSecondsOnly(getTimeElapsedElement().text(), ':');
					trackLength = hmsToSecondsOnly($("#time_container_duration").text(), ':');
				}else if(hostname == "play.spotify.com"){
					trackPosition = hmsToSecondsOnly($('#app-player').contents().find("#progress").find("#track-current").text(), ':');
					trackLength = hmsToSecondsOnly($('#app-player').contents().find("#progress").find("#track-length").text(), ':');
				}else if(hostname.indexOf('deezer.com') > -1 ){
					trackPosition = hmsToSecondsOnly($(".progress-time:eq(0)").text(), ':');
					trackLength = hmsToSecondsOnly($(".progress-length:eq(0)").text(), ':');
				}else if(hostname.indexOf('rdio.com') > -1 ){
					trackPosition = hmsToSecondsOnly($(".time:eq(0)").text(), ':');
					trackLength = hmsToSecondsOnly($(".duration:eq(0)").text(), ':');
				}else if(hostname.indexOf('grooveshark.com') > -1 ){
					trackPosition = hmsToSecondsOnly($("#time-elapsed").text(), ':');
					trackLength = hmsToSecondsOnly($("#time-total").text(), ':');
				}else if(hostname.indexOf('pandora.com') > -1 ){
					trackPosition = hmsToSecondsOnly($(".elapsedTime:eq(0)").text(), ':');
					var trackRemaining = hmsToSecondsOnly($(".remainingTime:eq(0)").text(), ':');
					trackLength = trackPosition + trackRemaining;
				}else if(hostname.indexOf('superplayer.fm') > -1 ){
					trackPosition = hmsToSecondsOnly($("span[data-function='track-current-time']").first().text(), ':');
					trackLength = hmsToSecondsOnly($("span[data-function='track-total-time']").first().text(), ':');
				}else if(hostname.indexOf('youtube.com') > -1 ){
					trackPosition = hmsToSecondsOnly($(".ytp-time-current:eq(0)").text(), ':');
					trackLength = hmsToSecondsOnly($(".ytp-time-duration:eq(0)").text(), ':');
				}else if(hostname.indexOf('songza.com') > -1 ){
					// I could not find this info inside the html :(
					trackPosition = -1;
					trackLength = -1;
				}else if(hostname.indexOf('tunein.com') > -1 ){
					// Its an actual radio station, I dont think theres any way we can find this info
					trackPosition = -1;
					trackLength = -1;
				}
			} catch(err){
				console.log("Check out this awesome error while retriving player position: "+err.message);
			}
//			console.log(trackPosition+"/"+trackLength);
			var extraTime=(new Date().getTime()-timeOnLastFullSecond)/1000;
			if(extraTime>1)extraTime=1;
			if(trackPosition!=-1)trackPosition+=extraTime;
			var si=getSongInfo();
			var at=si.currentArtist+si.currentSong;
			var response = {position:trackPosition, length:trackLength, newSong:!(at==localArtistTrack || !localArtistTrack)};
//			console.log(trackPosition);
			sendResponse(response);
			localArtistTrack=at;
		break;
		case "setDelay":
			delay=message.delay;
		break;
		case "getDelay":
			sendResponse(delay);
		break;
		case "toggleOverlay":
		console.log("inicio");
		if ($( "#play_music_lyrics_fetcher_overlay" ).length)$( "#play_music_lyrics_fetcher_overlay" ).remove();
		else{
			$("body").append("<div id='play_music_lyrics_fetcher_overlay' style='position:fixed;z-index:19999999999;top:0'></div>");
			$( "#play_music_lyrics_fetcher_overlay" ).draggable({
				containment: "window",
                cursor: "move",
				scroll: false
			});
			$( "#play_music_lyrics_fetcher_overlay" ).load(chrome.extension.getURL('pages/overlay.html'));
		}
			sendResponse("ok");
		break;
	}
});




function getTimeElapsedElement(){
	var hostname = $('<a>').prop('href', document.location).prop('hostname');
	try{
		if(hostname == "play.google.com"){
			return $("#time_container_current");
		}else if(hostname == "play.spotify.com"){
			return $('#app-player').contents().find("#progress").find("#track-current");
		}else if(hostname.indexOf('deezer.com') > -1 ){
			return $(".progress-time:eq(0)");
		}else if(hostname.indexOf('rdio.com') > -1 ){
			return $(".time:eq(0)");
		}else if(hostname.indexOf('grooveshark.com') > -1 ){
			return $("#time-elapsed");
		}else if(hostname.indexOf('pandora.com') > -1 ){
			return $(".elapsedTime:eq(0)");
		}else if(hostname.indexOf('superplayer.fm') > -1 ){
			return $("span[data-function='track-current-time']");
		}else if(hostname.indexOf('youtube.com') > -1 ){
			return $(".ytp-time-current:eq(0)");
		}else{
			return null;
		}
	} catch(err){
		console.log("Check out this awesome error while retriving getTimeElapsedElement: "+err.message);
	}
}


function getSongInfo(){
	var currentSong;
	var currentArtist;
	var currentAlbum;
	var isPlaying=false;

	var hostname = $('<a>').prop('href', document.location).prop('hostname');
	try{
		if(hostname == "play.google.com"){
			currentSong = $('#player-song-title').text();
			if(!currentSong)currentSong = $('#playerSongTitle').text(); //Old layout
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
			isPlaying = true;
		}else if(hostname.indexOf('songza.com') > -1 ){
			currentArtist = $(".miniplayer-info-artist-name:eq(0) a:eq(0)").text().split("by ")[1];
			currentSong = $(".miniplayer-info-track-title:eq(0) a:eq(0)").text();
			currentAlbum = 'Unknown';
			isPlaying = (currentSong.trim().length>0 && currentArtist.trim().length>0)?true:false;
		}else if(hostname.indexOf('tunein.com') > -1 ){
			currentArtist = $(".line1._navigateNowPlaying:eq(0)").text().split(" - ")[1];
			currentSong = $(".line1._navigateNowPlaying:eq(0)").text().split(" - ")[0];
			currentAlbum = 'Unknown';
			isPlaying = (currentSong.trim().length>0 && currentArtist.trim().length>0)?true:false;
		}
	} catch(err){
		console.log("Check out this awesome error: "+err.message);
	}
	var response = {isPlaying:isPlaying,
				currentSong:currentSong,
				currentArtist:currentArtist,
				currentAlbum:currentAlbum};
	return response;
}


function hmsToSecondsOnly(str, delimiter) {
    var p = str.split(delimiter),
        s = 0, m = 1;

    while (p.length > 0) {
    	a = p.pop();
        s += m * parseInt(Math.abs(a), 10);
        m *= 60;
    }
    return s;
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


