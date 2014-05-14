var devkey = "INSERT_DEV_KEY_HERE";
var domain = "http://www.botchris.com/";
var session_token = "";

function gup(name, myString) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( myString );
  if( results == null )
    return "";
  else
    return results[1];
}

function escapeHTML(str) {
  var div = document.createElement('div');
  var text = document.createTextNode(str);
  div.appendChild(text);
  return div.innerHTML;
}

function getCurrentPlaylist() {
  return gup('playlist_id', document.location.href);
}

function getAuthToken() {
  var session_cookie = readCookie('session_token');
  if(session_cookie != null && session_token == "") {
    session_token = session_cookie;
    api_is_ready("auth");
  }

  if(session_token == "") {
    return gup('token', document.location.href);
  } else {
    return session_token;
  }
}

function parse_song_results(data) {
  var ret = new Array();

  eval(data);

  var total_songs = data.feed.openSearch$totalResults;

  var begin = 0;
  var end = data.feed.openSearch$itemsPerPage.$t;

  var location = 0;

  for(var i = begin; i < end; ++i) {

    try {
      var update_id = eval('data.feed.entry['+i+'].id.$t');
      var title = eval('data.feed.entry['+i+'].media$group.media$title.$t');
      var url = eval('data.feed.entry['+i+'].media$group.media$player[0].url');
      var duration = eval('data.feed.entry['+i+'].media$group.yt$duration.seconds');
      var thumbnail = eval('data.feed.entry['+i+'].media$group.media$thumbnail[0].url');

      if(parseInt(duration) >= 60) {
        ret[location] = new Array();
        ret[location]["title"] = title;
        ret[location]["url"] = url;
        ret[location]["duration"] = duration;
        ret[location]["thumbnail"] = thumbnail;
        ret[location]["id"] = gup('v', url);
        ret[location]["update_id"] = update_id.substring(update_id.lastIndexOf('/')+1);
        ++location;
      }
    } catch(e) {
    }
  }
  return ret;
}

function search(searchString, callback) {
  searchString = escape(searchString);
  $.getJSON("http://gdata.youtube.com/feeds/api/videos?q=" + searchString + "&format=5&key=" + devkey + "&alt=json&callback=?", callback);
}

function parse_user_playlists(data) {
  data = data.replace(/yt:playlistId/g, "ytplaylistId");

  var ret = new Array();
  var parser = new DOMParser();
  xmlDoc = parser.parseFromString(data, "text/xml");
  var entries = xmlDoc.getElementsByTagName("entry");
  for(var i = 0; i < entries.length; ++i) {
    ret[i] = new Array();

    var title = entries[i].getElementsByTagName("title");
    ret[i]["title"] = title[0].childNodes[0].nodeValue;

    var id = entries[i].getElementsByTagName("ytplaylistId");
    ret[i]["id"] = id[0].childNodes[0].nodeValue;
  }

  return ret;
}

function get_user_playlists(callback) {
  if(getAuthToken() != "") {
    $.ajax({ url: domain + "cgi-bin/request_playlists.pl?devkey=" + devkey + "&authtoken=" + getAuthToken(), success: callback });
  }
}

var external_songs_callback;
var returned_song_datas;

function local_playlist_songs_callback(data) {
  returned_song_datas[returned_song_datas.length] = data;

  if(returned_song_datas.length == 4) {
    var ret = new Array();

    for(var i = 0; i < 4; ++i) {
      var parsed_results = parse_song_results(returned_song_datas[i]);
      ret = ret.concat(parsed_results);
    }
    returned_song_datas = new Array();
    external_songs_callback(ret);
  }
}

function get_playlist_songs(playlistID, callback) {
  external_songs_callback = callback;
  returned_song_datas = new Array();  

  var max_results = 50;
  for(var i = 1; i < 200; i += 50) {
    $.getJSON("http://gdata.youtube.com/feeds/api/playlists/" + playlistID + "?start-index=" + i + "&max-results=" + max_results + "&format=5&alt=json&callback=?", local_playlist_songs_callback);
  }
}

function delete_song_from_playlist(playlistID, updateID, callback) {
  if(getAuthToken() != "") {
    $.ajax({ url: domain + "cgi-bin/delete_song_from_playlist.pl?devkey=" + devkey + "&authtoken=" + getAuthToken() + "&playlist_id=" + playlistID + "&update_id=" + updateID, success: callback });
  }
}

function add_song_to_playlist(playlistID, songID, callback) {

    if (getAuthToken() != "") {
    $.ajax({ url: domain + "cgi-bin/add_song_to_playlist.pl?devkey=" + devkey + "&authtoken=" + getAuthToken() + "&playlist_id=" + playlistID + "&video_id=" + songID, success: callback });
  }
}

$(document).ready(function() {
  if(getAuthToken() != "" && session_token == "") {
    $.ajax({ url: domain + "cgi-bin/exchange_token.pl?authtoken=" + getAuthToken(),
    success: function(data)
    {
      var prefix = "Token=";
      session_token = data.substring(prefix.length);
      session_token = session_token.replace(/^\s+|\s+$/g,""); //trim
      createCookie('session_token',session_token,30);
      api_is_ready("auth");
    }});
  }
});

function format_seconds(seconds) {
  var min = Math.floor(seconds / 60);
  var sec = seconds % 60;

  var ret = min + ':';

  if(sec < 10) {
    ret += '0';
  }

  ret += sec;

  return ret;
}

var player_state = new Array();
player_state[0] = 0;
player_state[1] = 0;
player_state[2] = 0;

function api_is_ready(stat) {
  if(stat == "left") {
    player_state[0] = 1;
  } else if(stat == "right") {
    player_state[1] = 1;
  } else if(stat == "auth") {
    get_user_playlists(display_playlists);
  }

  if (player_state[0] == 1 && player_state[1] == 1 && player_state[2] == 0) {
    player_state[2] = 1;

    if (getCurrentPlaylist() == "") {
        get_songs("04104468F5DDD163");
    } else {
        get_songs(getCurrentPlaylist());
    }
  }
}
