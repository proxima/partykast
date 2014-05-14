(function($) {
    $.fn.shuffle = function() {
        return this.each(function() {
            var items = $(this).children();
            return (items.length)
        ? $(this).html($.shuffle(items))
        : this;
        });
    }

    $.shuffle = function(arr) {
        for (
      var j, x, i = arr.length; i;
      j = parseInt(Math.random() * i),
      x = arr[--i], arr[i] = arr[j], arr[j] = x
    );
        return arr;
    }
})(jQuery);

function hide_left() {
    $("#left_player").css("z-index", "0");
}
function hide_right() {
    $("#right_player").css("z-index", "0");
}
function show_left() {
    $("#left_player").css("z-index", "100");

}
function show_right() {
    $("#right_player").css("z-index", "100");
}


function show_control() {
    //$(".control_class").fadeIn("slow");
    //activate_idle();
}

function hide_control() {
    //if ($("ul[role='listbox']").css("display") == "none")
    //    $(".control_class").fadeOut("slow");
    //else
    //    activate_idle();
}

function activate_idle() {
    //$.idle(function() { hide_control(); }, 5000);
}

function run_search(query) {
    search(query, song_callback);
}

function delete_callback(data) {
//    alert(data); 
}

function song_callback(data) {
    var songs = data;
    var html = "";
    var title = "";
    var dur = "";
    var thumb = "";
    var append_prefix = "<tr><td>";
    var append_suffix = "</td></tr>";
    var append = "";
    var update_id = "";
    for (var i = 0; i < songs.length; ++i) {
        title = songs[i]["title"];
        dur =  format_seconds(parseInt(songs[i]["duration"]));
        thumb = songs[i]["thumbnail"];
        id = songs[i]["id"];
        update_id = songs[i]["update_id"];
        var delete_button = "<a class='delete_button' index='" + i + "' id='" + id + "' href='#' ><img class='delete_img' src='includes/img/delete.jpg' /></a>";
        append = "<tr update_id='" + update_id+ "'class='pl_title' src=" + thumb + " index=" + i + " id=" + id + "><td class='pl_title_td'>" + title + "</td><td>" + dur + "</td><td>" + delete_button + append_suffix;
        $("#pl").append(append);
    }
    $('#pl').each(function () {
        var tr = $(this);
        var i = 0;
        tr.find('TR').each(function () {
            $(this).attr("index", i);
            i++;
        });

    });
    $(".pl_title").tooltip({
        delay: 0,
        showURL: false,
        bodyHandler: function () {
            return $("<img/>").attr("src", $(this).attr("src"));
        }
    });

    $("#pl").tableDnD({
        onDrop: function(table, row) {
            var pre = $(".pl_title[id='" + row.id + "']").attr('index');
            $('#pl').each(function() {
                var tr = $(this);
                var i = 0;
                tr.find('TR').each(function() {
                    $(this).attr("index", i);
                    $(this).find(".delete_button").attr("index", i);
                    i++;
                });
            });
            var index = $(".pl_title[id='" + row.id + "']").attr('index');
            var id = $(".pl_title[id='" + row.id + "']").attr('id');
            if (pre == $("#cur_playing").val()) {
                var id = $(".pl_title[index='" + (parseInt(index) + 1) + "']").attr('id');
                $("#cur_playing").val(index);
                if (currentPlayer == 0) {
                    rightplayer.cueVideoById(id, 30);
                    rightplayer.playVideo();
                    rightplayer.pauseVideo();
                }
                else {
                    leftplayer.cueVideoById(id, 30);
                    leftplayer.playVideo();
                    leftplayer.pauseVideo();
                }
                $("#shuffle_container").hide();
            }

            if ((index - 1) == $("#cur_playing").val()) {
                if (currentPlayer == 0) {
                    rightplayer.cueVideoById(id, 30);
                    rightplayer.playVideo();
                    rightplayer.pauseVideo();
                }
                else {
                    leftplayer.cueVideoById(id, 30);
                    leftplayer.playVideo();
                    leftplayer.pauseVideo();
                }
            }
        }
    });

    $(".delete_button").click(function () {
        var id = $(this).attr("id");
        var index = $(".pl_title[id='" + id + "']").attr('index');

        //alert( $(".pl_title[id='GAuwi-B33VQ']").attr('index'));
        //alert(index);
        if ((index - 1) == $("#cur_playing").val()) {
            var new_id = $(".pl_title[index='" + (parseInt(index) + 1) + "']").attr('id');
            if (currentPlayer == 0) {
                rightplayer.cueVideoById(new_id, 30);
                rightplayer.playVideo();
                rightplayer.pauseVideo();
            }
            else {
                leftplayer.cueVideoById(new_id, 30);
                leftplayer.playVideo();
                leftplayer.pauseVideo();
            }

        }
        var update_id = $(".pl_title[id='" + id + "']").attr('update_id');
        $(".pl_title[id=" + id + "]").remove();
        if (getAuthToken() != '') {
            $("#login_button").attr("disabled", "true");
        }
        else {
            $("#playlist_selections").hide();
            $("#login_button").removeAttr("disabled");
        }
        //delete_song_from_playlist(playlistID, update_id, callback)
        if (getAuthToken() != '') {
            var playlistID = getCurrentPlaylist();
            delete_song_from_playlist(playlistID, update_id, delete_callback);
        }
        $('#pl').each(function () {
            var tr = $(this);
            var i = 0;
            tr.find('TR').each(function () {
                $(this).attr("index", i);
                i++;
            });

        });
    });

    var id1 = $(".pl_title[index='0']").attr("id");
    var id2 = $(".pl_title[index='1']").attr("id");
    
    init(id1, id2);
    play();
    $(".delete_button[id='" + id1 + "']").hide();
    $.unblockUI();    
}
function add_to_playlist_callback(data) {
    var loc = document.getElementById("output");
    loc.innerHTML = escapeHTML(data);
}

function add_to_playlist(playlist_id, video_id) {
    add_song_to_playlist(playlist_id, video_id, add_to_playlist_callback);
}

function get_songs(id) {
    get_playlist_songs(id, song_callback);

}

function display_playlists(data) {
	$("#playlist_seclections").append(escapeHTML(data));
	var ret = parse_user_playlists(data);
	var url = "http://www.botchris.com/party/index.html?playlist_id=";
	$("#playlist_selections").show();
	for(var i = 0;i < ret.length; i++)
	{
		$("#playlist_selections").append("<a href=" + url + ret[i]['id'] + ">" + ret[i]['title'] + "</a><br />");
	}
	//alert(ret[0]["id"]);

}

$(document).ready(function() {
    //slider control
    $("#volume_slider").slider({
        orientation: 'vertical',
        slide: function(event, ui) {
            var leftplayer = document.getElementById("left");
            var rightplayer = document.getElementById("right");
            var volume = $("#volume_slider").slider("value");
            leftplayer.setVolume(volume);
            rightplayer.setVolume(volume);
        }
    });
    $(".selector").bind("slide", function(event, ui) { });

    //init current volume to slider
    $("#volume_slider").slider("value", 75);

    //corner boxes
    $("#logo").corner();
    $(".control_class").corner();
    $("#clock_container_top").corner();
    $("#left_player").corner();
    $("#right_player").corner();
    $("#search_input").click(function() {
        $("#search_input").val("");
    });
    //$("#left_player").center();
    //$("#right_player").center();
    //$("#message").center();

    //$("#player_window").tooltip();
    /*
    $("body").keypress(function () {
    activate_idle();
    });
    $("body").mousemove(function (event) {

        activate_idle();
    });
    $("#clock_container").click(function () {
    show_control();
    });
    $("#message").click(function () {
    hide_control();
    });
    show_control();
    */

    $("#search_input").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "http://gdata.youtube.com/feeds/api/videos?q=" + escape($("#search_input").val()) + "&format=5&key=" + devkey + "&alt=json&callback=?",
                dataType: "jsonp",
                data: {
                    featureClass: "P",
                    style: "full",
                    maxRows: 12,
                    name_startsWith: request.term
                },
                success: function(data) {
                    eval(data);
                    var title = eval('data.feed.entry[0].media$group.media$title.$t');
                    //alert();
                    response($.map(data.feed.entry, function(item) {
                        return {
                            label: item.media$group.media$title.$t + " (" + format_seconds(parseInt(item.media$group.yt$duration.seconds)) + ")",
                            url: item.media$group.media$player[0].url,
                            thumbnail: item.media$group.media$thumbnail[0].url,
                            id: gup('v', item.media$group.media$player[0].url),
                            duration: item.media$group.yt$duration.seconds,
                            title: item.media$group.media$title.$t
                        }
                    }))
                }
            })
        },
        minLength: 4,
        select: function(event, ui) {
            //alert(ui.item.duration);
            var thumbnail = ui.item.thumbnail;
            var id = ui.item.id;
            var title = ui.item.title;
            var dur = format_seconds(parseInt(ui.item.duration));
            var append_suffix = "</td></tr>";
	    var delete_button = "<a class='delete_button' index=0 id='" + id + "' href='#' ><img class='delete_img' src='includes/img/delete.jpg' /></a>";
            var append = "<tr style='background-color:Yellow;' class='pl_title' src=" + thumbnail + " index=200 id=" + id + "><td class='pl_title_td'>";
	    append += title + "</td><td>" + dur + "</td><td>" + delete_button + append_suffix;
            var cur_playing = $("#cur_playing").val();
            $(".pl_title[index='" + cur_playing + "']").after(append);

            //$("#pl").append(append);
            $('#pl').each(function() {
                var tr = $(this);
                var i = 0;
                tr.find('TR').each(function() {
                    $(this).attr("index", i);
                    i++;
                });

            });
            if (currentPlayer == 0) {
                //alert("rightplayer queue");
                rightplayer.cueVideoById(id, 30);
                rightplayer.playVideo();
                rightplayer.pauseVideo();
            }
            else {
                //alert("leftplayer queue");
                leftplayer.cueVideoById(id, 30);
                leftplayer.playVideo();
                leftplayer.pauseVideo();
            }

            $("#pl").tableDnD({
                onDrop: function(table, row) {
                    var pre = $(".pl_title[id='" + row.id + "']").attr('index');
                    $('#pl').each(function() {
                        var tr = $(this);
                        var i = 0;
                        tr.find('TR').each(function() {
                            $(this).attr("index", i);
                            $(this).find(".delete_button").attr("index", i);
                            i++;
                        });
                    });
                    var index = $(".pl_title[id='" + row.id + "']").attr('index');
                    var id = $(".pl_title[id='" + row.id + "']").attr('id');
                    if (pre == $("#cur_playing").val()) {
                        var id = $(".pl_title[index='" + (parseInt(index) + 1) + "']").attr('id');
                        $("#cur_playing").val(index);
                        if (currentPlayer == 0) {
                            rightplayer.cueVideoById(id, 30);
                            rightplayer.playVideo();
                            rightplayer.pauseVideo();
                        }
                        else {
                            leftplayer.cueVideoById(id, 30);
                            leftplayer.playVideo();
                            leftplayer.pauseVideo();
                        }
                        $("#shuffle_container").hide();
                    }

                    if ((index - 1) == $("#cur_playing").val()) {
                        if (currentPlayer == 0) {
                            rightplayer.cueVideoById(id, 30);
                            rightplayer.playVideo();
                            rightplayer.pauseVideo();
                        }
                        else {
                            leftplayer.cueVideoById(id, 30);
                            leftplayer.playVideo();
                            leftplayer.pauseVideo();
                        }
                    }
                }
            });

    $(".delete_button").click(function () {
        var id = $(this).attr("id");
        var index = $(".pl_title[id='" + id + "']").attr('index');

        //alert( $(".pl_title[id='GAuwi-B33VQ']").attr('index'));
        //alert(index);
        if ((index - 1) == $("#cur_playing").val()) {
            var new_id = $(".pl_title[index='" + (parseInt(index) + 1) + "']").attr('id');
            if (currentPlayer == 0) {
                rightplayer.cueVideoById(new_id, 30);
                rightplayer.playVideo();
                rightplayer.pauseVideo();
            }
            else {
                leftplayer.cueVideoById(new_id, 30);
                leftplayer.playVideo();
                leftplayer.pauseVideo();
            }

        }
        var update_id = $(".pl_title[id='" + id + "']").attr('update_id');
        $(".pl_title[id=" + id + "]").remove();
        if (getAuthToken() != '') {
            $("#login_button").attr("disabled", "true");
        }
        else {
            $("#playlist_selections").hide();
            $("#login_button").removeAttr("disabled");
        }
        //delete_song_from_playlist(playlistID, update_id, callback)
        if (getAuthToken() != '') {
            var playlistID = getCurrentPlaylist();
            delete_song_from_playlist(playlistID, update_id, delete_callback);
        }
        $('#pl').each(function () {
            var tr = $(this);
            var i = 0;
            tr.find('TR').each(function () {
                $(this).attr("index", i);
                i++;
            });

        });
    });

            $(".pl_title").tooltip({
                delay: 0,
                showURL: false,
                bodyHandler: function() {
                    return $("<img/>").attr("src", $(this).attr("src"));
                }
            });
            add_song_to_playlist(getCurrentPlaylist(), id, null);
        }
    });

    //login shit
    $("#login_button").click(function() {
        window.location.href = "http://www.youtube.com/auth_sub_request?scope=http://gdata.youtube.com&session=1&next=http://www.botchris.com/partykast/index.html&secure=0";
    });

    //alert(gup('playlist_id', document.location.href));

    //if empty or not
    if (getAuthToken() != '') {
        $("#login_button").attr("disabled", "true");
    }
    else {
        $("#playlist_selections").hide();
        $("#login_button").removeAttr("disabled");
    }
    $("#shuffle").click(function() {
        var arr = [];
        var arr2 = [];
        var index = 0;
        $(".pl_title").each(function() {
            index = parseInt($(this).attr("index"));
            if (index != 0) {
                arr.push(index);
            }
        });
        arr = $.shuffle(arr);
        var start_obj = $(".pl_title[index='0']");
        arr2.push(start_obj);
        for (var i = 0; i < arr.length; i++) {
            var obj = $(".pl_title[index='" + arr[i] + "']");
            arr2.push(obj)
        }
        $(".pl_title").remove();
        for (var i = 0; i < arr2.length; i++) {
            $("#pl").append(arr2[i]);
        }

        $('#pl').each(function() {
            var tr = $(this);
            var i = 0;
            tr.find('TR').each(function() {
                $(this).attr("index", i);
                $(this).find(".delete_button").attr("index", i);
                i++;
            });
        });

        $("#pl").tableDnD({
            onDrop: function(table, row) {
                var pre = $(".pl_title[id='" + row.id + "']").attr('index');
                $('#pl').each(function() {
                    var tr = $(this);
                    var i = 0;
                    tr.find('TR').each(function() {
                        $(this).attr("index", i);
                        $(this).find(".delete_button").attr("index", i);
                        i++;
                    });
                });
                var index = $(".pl_title[id='" + row.id + "']").attr('index');
                var id = $(".pl_title[id='" + row.id + "']").attr('id');
                if (pre == $("#cur_playing").val()) {
                    var id = $(".pl_title[index='" + (parseInt(index) + 1) + "']").attr('id');
                    $("#cur_playing").val(index);
                    if (currentPlayer == 0) {
                        rightplayer.cueVideoById(id, 30);
                        rightplayer.playVideo();
                        rightplayer.pauseVideo();
                    }
                    else {
                        leftplayer.cueVideoById(id, 30);
                        leftplayer.playVideo();
                        leftplayer.pauseVideo();
                    }
                    $("#shuffle_container").hide();
                }

                if ((index - 1) == $("#cur_playing").val()) {
                    if (currentPlayer == 0) {
                        rightplayer.cueVideoById(id, 30);
                        rightplayer.playVideo();
                        rightplayer.pauseVideo();
                    }
                    else {
                        leftplayer.cueVideoById(id, 30);
                        leftplayer.playVideo();
                        leftplayer.pauseVideo();
                    }
                }
            }
        });


        var index = parseInt($("#cur_playing").val());
        var id = $(".pl_title[index='" + (index + 1) + "']").attr('id');
        if (currentPlayer == 0) {
            rightplayer.cueVideoById(id, 30);
            rightplayer.playVideo();
            rightplayer.pauseVideo();
        }
        else {
            leftplayer.cueVideoById(id, 30);
            leftplayer.playVideo();
            leftplayer.pauseVideo();
        }
        $(".pl_title").tooltip({
            delay: 0,
            showURL: false,
            bodyHandler: function() {
                return $("<img/>").attr("src", $(this).attr("src"));
            }
        });
    });
});
