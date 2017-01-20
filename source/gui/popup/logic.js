var currentTabId = Number(getUrlParameter("tab"));

if(currentTabId){
    chrome.runtime.connect().postMessage({tabId: currentTabId});
    chrome.tabs.sendMessage(currentTabId, {query: "INFO_REQUEST"});
} else {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    currentTabId = tabs[0].id;
    chrome.runtime.connect().postMessage({tabId: currentTabId});
    chrome.tabs.sendMessage(currentTabId, {query: "INFO_REQUEST"});
      setTimeout(openPopup, 1000);
  })
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(!sender.tab || sender.tab.id != currentTabId){
    return;
  }
	switch(message.query) {
    case 'LYRICS_EVENT':
      switch(message.status){
        case "LOAD_START":
          onLyricsLoadStart();
          break;
        case "LOAD_FINISH":
          onLyricsLoadFinished(message.lyrics);
          break;
        case "LOAD_ERROR":
          onLyricsLoadError(message.error);
          break;
      }
      break;
    case 'POSITION_CHANGED':
      onPositionChanged(message.position);
      break;
  }
});

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function openPopup(){
    var w = $(window).width()+30;
    var h = $(window).height()-20;
    var lyricsPopup = window.open(
        './popup.html?tab='+currentTabId,
        'play-music-lyrics-fetcher-window-'+currentTabId,
        'width='+($(window).width()+30)+', height='+($(window).height()-20)
    );
    lyricsPopup.focus();

    // chrome.windows.create({'url': './gui/popup/popup.html?tab='+currentTabId, 'type': 'popup', width:w<300?300:w, height:h<600?600:h , 'state': 'docked'  }, function(window) {
    //     window.focus();
    // });
  window.close();
}
