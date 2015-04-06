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
