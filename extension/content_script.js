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
			var url = document.location;
			var hostname = $('<a>').prop('href', url).prop('hostname');
			if(hostname == "play.google.com"){
				currentSong = $('#playerSongTitle').text();
				currentArtist = $('#player-artist').text();
				currentAlbum = $('.player-album').text();
			}else if(hostname == "play.spotify.com"){
				currentArtist = $('#app-player').contents().find("#player").find("#track-artist").text();
				currentSong = $('#app-player').contents().find("#player").find("#track-name").text();
				currentAlbum = 'Unknown';
			}

            console.log(currentArtist+": "+currentSong+" ("+currentAlbum+")");
			var response = {isPlaying:currentSong.trim().length>0?true:false,
						currentSong:currentSong,
						currentArtist:currentArtist,
						currentAlbum:currentAlbum};
			sendResponse(response);
		break;

	}
});
