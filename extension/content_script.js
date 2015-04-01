//Teste para saber se o javascript esta rodando
/*if (window.jQuery) {  
alert("OK");
} else {
alert("NOK");
}
*/

/* Esse javascript roda em background, eh a unica forma de acessar o conteudo da pagina.
 * Temos um listener que fica escutando as mensagens recebidas e tomando decisoes de acordo
*/
var storedArtist;
var storedSong;
var cachedLyric;
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){

	switch(message.query){
		case "getInfo":
			var currentSong = $('#playerSongTitle').text();
			var currentArtist = $('#player-artist').text();
			var currentAlbum = $('.player-album').text();
            console.log(currentArtist+": "+currentSong+" ("+currentAlbum+")");
			var response = {isPlaying:currentSong==""?false:true,
						currentSong:currentSong,
						currentArtist:currentArtist,
						currentAlbum:currentAlbum,
						cachedLyric:(storedArtist==currentArtist && storedSong==currentSong)?cachedLyric:""};
			sendResponse(response);
		break;
		case "storeLyric":
			cachedLyric = message.lyrics;
			storedArtist = message.artist;
			storedSong = message.song;
		break;
	}



});
