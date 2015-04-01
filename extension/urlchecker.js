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
  if (tab.url.indexOf('play.google.com/music/listen') > -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};
// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
