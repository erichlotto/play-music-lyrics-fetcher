var currentTabId

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
  currentTabId = tabs[0].id;
  chrome.runtime.connect().postMessage({tabId: currentTabId});
  chrome.tabs.sendMessage(currentTabId, { query:"INFO_REQUEST" });
})

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
