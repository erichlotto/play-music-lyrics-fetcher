/**
 * STARTUP: check if current URL is supported:
 */
var siteModulePath = 'site_modules/' + document.location.hostname + '.js';
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // URL is supported!
       chrome.runtime.sendMessage({query: 'SHOW_PAGE_ACTION', path: siteModulePath});
    } else {
        console.log("to support this website, create a file named " + document.location.hostname + " .js under /site_modules")
    }
};
xhttp.open("GET", chrome.extension.getURL(siteModulePath), true);
xhttp.send();
