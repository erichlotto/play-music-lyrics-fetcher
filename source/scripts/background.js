//We need to show the icon if we're on Google Play Music. Both methods should work. Aparently the first is the correct way of doing it, but sometimes, when I change the directory structure, it simply fails and does not come back. Needs debugging.

// FIRST WAY

/*chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        urlContains: 'play.google.com/music/listen'
                    }
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});
*/

// SECOND WAY. NEEDS "TABS" PERMISSION

// Fallback, Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'g' is found in the tab's URL...
  if (tab.url.indexOf('play.google.com/music/listen') > -1 || 
		tab.url.indexOf('deezer.com') > -1 ||
		tab.url.indexOf('rdio.com') > -1 ||
		tab.url.indexOf('grooveshark.com') > -1 ||
		tab.url.indexOf('pandora.com') > -1 ||
		tab.url.indexOf('superplayer.fm') > -1 ||
		tab.url.indexOf('youtube.com/watch?v=') > -1 ||
		tab.url.indexOf('songza.com') > -1 ||
		tab.url.indexOf('tunein.com') > -1 ||
		tab.url.indexOf('play.spotify.com') > -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};
// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);


// Define stored variables on first run
chrome.storage.sync.get('timedLyrics', function(obj) {
	if(obj.timedLyrics == undefined)chrome.storage.sync.set({'timedLyrics': true});
});
chrome.storage.sync.get('autoScroll', function(obj) {
    if(obj.autoScroll == undefined)chrome.storage.sync.set({'autoScroll': true});
});
chrome.storage.sync.get('overlay', function(obj) {
    if(obj.overlay == undefined)chrome.storage.sync.set({'overlay': false});
});


var backgroundTempArtist;
var backgroundTempSong;
var backgroundTempLyrics;

function storeBackgroundTempData(artist, song, lyrics){
    backgroundTempArtist=artist;
    backgroundTempSong=song;
    backgroundTempLyrics=lyrics;
}
function getBackgroundTempData(){
    return {'artist':backgroundTempArtist, 'song':backgroundTempSong, 'lyrics':backgroundTempLyrics};
}
