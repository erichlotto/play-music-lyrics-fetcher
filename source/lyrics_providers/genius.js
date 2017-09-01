function fetchLyrics(DOMArtist, DOMTrack){
    chrome.storage.sync.get('geniusAccessToken', function(obj) {
      if (!obj.geniusAccessToken) {
        onLyricsLoadError(DOMArtist, DOMTrack, "No genius.com api access token provided");
        return;
      }
      var url = "https://api.genius.com/search?access_token=" + obj.geniusAccessToken + "&q=" + DOMArtist + "%20" + DOMTrack + "&per_page=1";
      jQuery.getJSON(url, function(data) {
        loadLyricsPage(DOMArtist, DOMTrack, data.response.hits[0]);
      }).fail(function(err) {
        // Something went wrong with the request. Alert the user
        onLyricsLoadError(DOMArtist, DOMTrack, "There was an error trying to reach the API");
        console.log(err);
      });
    })
}

function loadLyricsPage(DOMArtist, DOMTrack, hit){
    $.get( hit.result.url, function( data ) {
        var html = $($.parseHTML(data));

        var artist = hit.result.primary_artist && hit.result.primary_artist.name;
        var track = hit.result.title;
        var lyrics = html.find(".lyrics").text().replace(/(\[.+\])/g, '');
        var response = {
            "artist": artist,
            "track": track,
            "static": lyrics.trim()
        };

        onLyricsLoadFinished(response, DOMArtist, DOMTrack);

    }).fail(function(err){
        // Something went wrong with the request. Alert the user
        onLyricsLoadError(DOMArtist, DOMTrack, "There was an error trying to reach the API");
    });
}
