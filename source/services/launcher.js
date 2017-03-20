/**
 * STARTUP: check if current URL is supported:
 */

var sitemodules;

jQuery.getJSON(chrome.extension.getURL("/site_modules/_modules.json"), function (data) {
    sitemodules = data;
    newUrlFound();
});

function newUrlFound(){
    for(var i=0; i<sitemodules.length; i++){
        if(document.location.href.indexOf(sitemodules[i]["url"]) >-1 ){
            chrome.runtime.sendMessage({query: 'SHOW_PAGE_ACTION', path: "/site_modules/" + sitemodules[i]["file"] });
            return;
        }
    }
    chrome.runtime.sendMessage({ query: 'HIDE_PAGE_ACTION' });
}