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
//            chrome.tabs.executeScript(sender.tab.id, {file: "./lyrics_providers/vagalume.js"});
            chrome.tabs.executeScript(sender.tab.id, {file: "./services/lyrics_provider_chooser.js"});
            chrome.tabs.executeScript(sender.tab.id, {file: "./services/main.js"});
            chrome.pageAction.show(sender.tab.id);
            break;
        case "LOAD_LYRIC_PROVIDER":
            chrome.tabs.executeScript(sender.tab.id, {file: "./lyrics_providers/"+request.file}, function(){
                sendResponse(request.file);
            });
            return true;
    }
});
