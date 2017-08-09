function fetchLyrics(DOMArtist, DOMTrack) {
    DOMArtist = DOMArtist.trim();
    DOMTrack = DOMTrack.trim();

    var url = "http://www.darklyrics.com/" + DOMArtist.substring(0, 1).toLowerCase() + "/" + DOMArtist.toLowerCase().replace(/[ '’]/g, "") + ".html";


    chrome.runtime.sendMessage({query: 'MAKE_INSECURE_REQUEST', url: url }, function(response){
        if(response.error == undefined){
            //SUCCESS
            var html = $($.parseHTML(response.content));
            parseArtistPage(html, DOMArtist, DOMTrack);
        } else {
            onLyricsLoadError(DOMArtist, DOMTrack, "No lyrics found for " + toTitleCase(DOMTrack) + " by " + toTitleCase(DOMArtist));
        }
    });

}

function parseArtistPage(html, DOMArtist, DOMTrack){
    if(html.find('h1').length>0){
        //Artista encontrado
        var lyricLink = html.find("a:contains('"+DOMTrack+"')").first().attr('href');
        if(lyricLink != undefined && lyricLink.length > 0){
            var url = "http://www.darklyrics.com" + lyricLink.split("..")[1];
            chrome.runtime.sendMessage({query: 'MAKE_INSECURE_REQUEST', url: url }, function(response){
                if(response.error == undefined){
                    //SUCCESS
                    parseLyricsPage(response.content, url.split('#')[1], DOMArtist, DOMTrack);
                } else {
                    var artistName = html.find('h1').text().split("LYRICS")[0].trim();
                    onLyricsLoadError(DOMArtist, DOMTrack, "We could not find song " + DOMTrack + " by " + toTitleCase(artistName));
                }
            });
        } else {
            var artistName = html.find('h1').text().split("LYRICS")[0].trim();
            onLyricsLoadError(DOMArtist, DOMTrack, "We could not find song " + DOMTrack + " by " + toTitleCase(artistName));
        }

    } else {
            onLyricsLoadError(DOMArtist, DOMTrack, "No lyrics found for " + toTitleCase(DOMTrack) + " by " + toTitleCase(DOMArtist));
    }
}

function parseLyricsPage(htmlString, trackNumber, DOMArtist, DOMTrack){
    var html = $($.parseHTML(htmlString));
    var artistName = toTitleCase(html.find('h1').text().split("LYRICS")[0].trim());
    var trackName = html.find("a[name='" + trackNumber + "']").text().split(".")[1].trim();
    var lyrics = htmlString.split('<h3><a name="' + trackNumber + '">')[1].split("<br /><br />")[0].split("</h3>")[1];

    var lyricsHTML = $($.parseHTML(lyrics));
    if(lyricsHTML.text() != undefined && lyricsHTML.text().trim().length > 0){
        onLyricsLoadFinished({
            "artist": artistName,
            "track": trackName,
            "static": lyricsHTML.text().trim(),
        }, DOMArtist, DOMTrack);
    } else {
        onLyricsLoadError(DOMArtist, DOMTrack, "Error parsing lyric");
    }
}


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
