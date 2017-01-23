/**
 * Used on some sites to parse the current track's position
 */
function hmsToSecondsOnly(str, delimiter) {
    var p = str.split(delimiter),
        s = 0, m = 1;

    while (p.length > 0) {
    	a = p.pop();
        s += m * parseInt(Math.abs(a), 10);
        m *= 60;
    }
    return s;
}


/**
 * Check if a number is integer
 */
function isInt(n) {
   return n % 1 === 0;
}


/**
 * Get parameter from the current url
 */
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


/**
 * Styled console.log()
 */
function log(message){
    console.log('%c'+message, 'background: #FA8521; color: #ffffff; padding: 1px 3px;');
}