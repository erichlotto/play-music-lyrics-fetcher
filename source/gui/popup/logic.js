/**
 * Send message to open window (the content script must keep track of the currently open window)
 * so it's ID can be passed later
 */
function openWindow(){
    playerTab.postMessage({query:'OPEN_POPUP_WINDOW'});
}

/**
 * Actually open the popup on response from content script
 */
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


/**
 * Delay Management
 */
var delay = 0;
function setDelay(delay){
  playerTab.postMessage( { query:'SET_DELAY', delay:delay } );
}
function delayUp(){
  setDelay(delay + 0.5);
}
function delayDown(){
  setDelay(delay - 0.5);
}


/**
 * STARTUP
 */
var currentTabId = Number(getUrlParameter("tab"));
var docked = true;
if(currentTabId){
  docked = false;
    start();
} else {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      currentTabId = tabs[0].id;
      start();
  })
}


/**
 * Communication with the player tab
 */
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
                delay = message.position.delay;
                onPositionChanged(message.position);
                break;
        }
    });
    playerTab.onDisconnect.addListener(function(port){
        window.close();
    });
    playerTab.postMessage({query: "INFO_REQUEST"});
}
