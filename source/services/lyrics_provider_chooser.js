/**
 * Keep a list of all available lyrics providers and the index of the currently being used
 */
var lyricsProviders;
var currentLyricsProviderIndex;

jQuery.getJSON(chrome.extension.getURL("/lyrics_providers/_priority.json"), function (data) {
    lyricsProviders = data;
});

function fetchFromFirstLyricsProvider(DOMArtist, DOMTrack){
    currentLyricsProviderIndex = -1;
    onLyricsLoadStart();
    fetchFromNextLyricsProvider(DOMArtist, DOMTrack);
}

function fetchFromNextLyricsProvider(DOMArtist, DOMTrack){
    currentLyricsProviderIndex ++;
    chrome.runtime.sendMessage({query: 'LOAD_LYRIC_PROVIDER', file: lyricsProviders[currentLyricsProviderIndex] }, function(response){
        log("Fetching using "+response);
        fetchLyrics(DOMArtist, DOMTrack);
    });
}

function nextLyricsProviderExists(){
    return currentLyricsProviderIndex + 1 < lyricsProviders.length;
}
