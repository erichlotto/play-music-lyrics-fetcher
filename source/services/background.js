/**
 * Listener to display pageAction and start extension.
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.query){
        case "SHOW_PAGE_ACTION":
            // chrome.tabs.executeScript(sender.tab.id, {code: request.code});
            chrome.tabs.executeScript(sender.tab.id, {file: request.path});
            chrome.tabs.executeScript(sender.tab.id, {file: "./services/dependencies/jquery.min.js"});
            chrome.tabs.executeScript(sender.tab.id, {file: "./services/utils.js"});
            chrome.tabs.executeScript(sender.tab.id, {file: "./services/dom_listener.js"});
            chrome.tabs.executeScript(sender.tab.id, {file: "./lyrics_providers/vagalume.js"});
            chrome.tabs.executeScript(sender.tab.id, {file: "./services/main.js"});
            chrome.pageAction.show(sender.tab.id);
            break;
    }
});


/**
 * Keep a track of wich tabs have a view attached listening for the music.
 */
var numberOfConnectionsPerTab = [];
chrome.runtime.onConnect.addListener(function(port){
  var tabId;
  port.onMessage.addListener(function(msg){
    tabId = msg.tabId;
    if(!numberOfConnectionsPerTab[tabId])
      numberOfConnectionsPerTab[tabId] = 0;
    numberOfConnectionsPerTab[tabId]++;
    // We only tell the intervals to start on first occurence
    if(numberOfConnectionsPerTab[tabId] == 1){
      chrome.tabs.sendMessage(tabId, { query:"ACTIVE_LISTENER_FLAG", someoneListening: true });
    }
  });
  port.onDisconnect.addListener(function(port){
    numberOfConnectionsPerTab[tabId]--;
    if(numberOfConnectionsPerTab[tabId] == 0){
      chrome.tabs.sendMessage(tabId, { query:"ACTIVE_LISTENER_FLAG", someoneListening: false });
    }
  });
});

function isSomeoneListening(tabId){
  return numberOfConnectionsPerTab[tabId] > 0;
}
