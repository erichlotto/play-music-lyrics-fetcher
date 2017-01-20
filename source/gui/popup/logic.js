var currentTabId = Number(getUrlParameter("tab"));

if(currentTabId){
    chrome.runtime.connect().postMessage({tabId: currentTabId});
    chrome.tabs.sendMessage(currentTabId, {query: "INFO_REQUEST"});
} else {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    currentTabId = tabs[0].id;
    chrome.runtime.connect().postMessage({tabId: currentTabId});
    chrome.tabs.sendMessage(currentTabId, {query: "INFO_REQUEST"});
      setTimeout(openWindow, 3000);
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

function openWindow(){
    var w = $(window).width()+30;
    var h = $(window).height()-20;
    if(w<300)w=300;
    if(h<600)h=600;
    chrome.tabs.sendMessage(currentTabId, {query:'GET_WINDOW_ID'}, function(response){
        chrome.windows.get(response, function(){
            if (chrome.runtime.lastError) {
                chrome.windows.create({'url': './gui/popup/popup.html?tab='+currentTabId, 'type': 'popup', width:w, height:h }, function(window) {
                    chrome.tabs.sendMessage(currentTabId, {query: "WINDOW_OPEN", windowId:window.id});
                });
            } else {
                chrome.windows.update(response, {focused:true});
            }
        });
    });
}
