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
    playerTab.postMessage({query:'OPEN_POPUP_WINDOW'});
}

function displayWindow(windowId) {
    var w = $(window).width()+30;
    var h = $(window).height()-20;
    if(w<300)w=300;
    if(h<600)h=600;
    chrome.windows.get(windowId, function(){
        if (chrome.runtime.lastError) {
            chrome.windows.create({'url': './gui/popup/popup.html?tab='+currentTabId, 'type': 'popup', width:w, height:h }, function(window) {
                playerTab.postMessage({query: "WINDOW_OPEN", windowId:window.id});
            });
        } else {
            chrome.windows.update(windowId, {focused:true});
        }
    });
}



/* STARTUP */
var currentTabId = Number(getUrlParameter("tab"));
if(currentTabId){
    start();
} else {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      currentTabId = tabs[0].id;
      start();
      setTimeout(openWindow, 3000);
  })
}

var playerTab;
function start(){
    playerTab = chrome.tabs.connect(currentTabId, {name: "visualizer" + new Date().getTime() });
    playerTab.onMessage.addListener(function(message){
        switch(message.query) {
            case 'OPEN_POPUP_WINDOW':
                displayWindow(message.windowId);
                break;
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
    playerTab.onDisconnect.addListener(function(port){
        window.close();
    });
    playerTab.postMessage({query: "INFO_REQUEST"});
}