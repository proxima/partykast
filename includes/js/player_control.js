var leftplayer = 0;
var rightplayer = 0;
var seconds_per_song = 60;
var update_frequency_milli = 1000;
var default_start_location = 0;
var currentPlayer = -1;

function raise_min() {

    $("#s00").attr("src", "includes/img/0.gif");
    $("#s01").attr("src", "includes/img/0.gif");
    var cur_min = $("#cur_m").val();
    var ret = new Array();
    var int = parseInt(cur_min);
    int++;
    var str = int.toString();
    $("#cur_m").val(str);

    if (str.length == 1) {
        ret[0] = "0";
        ret[1] = str;
    }
    else if (parseInt(str) > 59) {
        $("#m00").attr("src", "includes/img/0.gif");
        $("#m01").attr("src", "includes/img/0.gif");
        $("#cur_m").val(0);
        raise_hour();
              
    }
    else {
        ret[1] = str.charAt(1).toString();
        ret[0] = str.charAt(0).toString();
    }    
    //$("#m0" + ret[0]).show();
    //$("#m1" + ret[1]).show();
    $("#m00").attr("src", "includes/img/" + ret[0]+ ".gif");
    $("#m01").attr("src", "includes/img/" + ret[1] + ".gif");    

}

function raise_hour() {

    $("#m00").attr("src", "includes/img/0.gif");
    $("#m01").attr("src", "includes/img/0.gif");
    var cur_min = $("#cur_h").val();
    var ret = new Array();
    var int = parseInt(cur_min);
    int++;
    var str = int.toString();
    $("#cur_h").val(str);
    if (str.length == 1) {
        ret[0] = "0";
        ret[1] = str;
    }
    else if (parseInt(str) > 59) {
        $("#m00").attr("src", "includes/img/0.gif");
        $("#m01").attr("src", "includes/img/0.gif");

    }
    else {
        ret[1] = str.charAt(1).toString();
        ret[0] = str.charAt(0).toString();
    }
    $("#h00").attr("src", "includes/img/" + ret[0] + ".gif");
    $("#h01").attr("src", "includes/img/" + ret[1] + ".gif");   

}

function getTime(played_so_far) {
    var ret = new Array();
    var str = "";
    if (played_so_far < 0) {
        return null;
    }
    else {
        str = played_so_far.toString().split('.')[0];
        if (str.length == 1) {
            ret[0] = "0";
            ret[1] = str;
        }
        else if (parseInt(str) > 59) {
            ret[0] = "5";
            ret[1] = "9";
        }
        else {

            ret[1] = str.charAt(1).toString();
            ret[0] = str.charAt(0).toString();
        }
    }
    return ret;
}

function play() {
    setTimeout('play()', update_frequency_milli);
    
    var played_so_far;

    var current_song_id = $(".pl_title[index='" + parseInt($("#cur_playing").val()) + "']").attr("id");

    if (currentPlayer == 0) {
        played_so_far = leftplayer.getCurrentTime() - get_start_time(current_song_id);
    }
    else {
        played_so_far = rightplayer.getCurrentTime() - get_start_time(current_song_id);
    }
    
    var time = getTime(played_so_far);
    
    //$(".clock_s").hide();
    if (time != null) {
        $("#s00").attr("src", "includes/img/" + time[0] + ".gif");
        $("#s01").attr("src", "includes/img/" + time[1] + ".gif");
    }
    else {
        $("#s00").show();
        $("#s10").show();
    }
    
    if (!leftplayer || !rightplayer) {
        return;
    }
    
    if (currentPlayer == 0 && played_so_far > seconds_per_song) {
            var id1_index = parseInt($("#cur_playing").val()) + 2;
            var id1 = $(".pl_title[index='" + id1_index + "']").attr("id");

            hide_left();
            sast(leftplayer, id1);
            	leftplayer.playVideo();
            leftplayer.pauseVideo();
            show_right();
            rightplayer.playVideo();
            $("#cur_playing").val(parseInt($("#cur_playing").val()) + 1);
            $(".pl_title").css("background-color", "White");
            $(".pl_title[index='" + (parseInt($("#cur_playing").val())) + "']").css("background-color", "AntiqueWhite");
            currentPlayer = 1;
            raise_min();
            $("#pl_container").stop().scrollTo($(".pl_title[index='" + (parseInt($("#cur_playing").val())) + "']"));
            $(".delete_button[index='" + parseInt($("#cur_playing").val()) + "']").hide();
            $(".delete_button[index='" + (parseInt($("#cur_playing").val()) - 1) + "']").show();
            if ($("#cur_playing").val() == "1") {
                $("#shuffle_container").hide();
            }
    }
    else if (currentPlayer == 1 && played_so_far > seconds_per_song) {
            var id2_index = parseInt($("#cur_playing").val()) + 2;
            var id2 = $(".pl_title[index='" + id2_index + "']").attr("id");
            hide_right();
            sast(rightplayer, id2);
            	rightplayer.playVideo();
            rightplayer.pauseVideo();

            show_left();
            leftplayer.playVideo();
            $("#cur_playing").val(parseInt($("#cur_playing").val()) + 1);
            $(".pl_title").css("background-color", "White");
            $(".pl_title[index='" + (parseInt($("#cur_playing").val())) + "']").css("background-color", "AntiqueWhite");
            $("#pl_container").stop().scrollTo($(".pl_title[index='" + (parseInt($("#cur_playing").val())) + "']"));
            currentPlayer = 0;
            raise_min();
            $(".delete_button[index='" + parseInt($("#cur_playing").val()) + "']").hide();
            $(".delete_button[index='" + (parseInt($("#cur_playing").val()) - 1) + "']").show();
            if ($("#cur_playing").val() == "1") {
                $("#shuffle_container").hide();
            }                              
    }

}

function onLeftPlayerStateChange(newState) {
    loc = document.getElementById("left_output");
    if(loc != null)
        loc.innerHTML = newState;
}

function onRightPlayerStateChange(newState) {
    loc = document.getElementById("right_output");
    if (loc != null)
        loc.innerHTML = newState;
}

function onLeftPlayerError(error_msg) {
//	leftplayer.stopVideo();
        sast(leftplayer, "P3VgOkYgGHo");
        leftplayer.playVideo();
	if(currentPlayer == 1)
	{
//	        leftplayer.pauseVideo();
	}
//	currentPlayer = 1;

}

function onRightPlayerError(error_msg) {
//    alert("Right player error: " + error_msg);
//	rightplayer.stopVideo();
        sast(rightplayer, "P3VgOkYgGHo");
//        rightplayer.playVideo();

	if(currentPlayer == 0)
	{
//		rightplayer.pauseVideo();
	}
//	currentPlayer = 0;
//	        rightplayer.pauseVideo();


}

function onYouTubePlayerReady(playerId) {
    if (playerId == "left") {
        leftplayer = document.getElementById("left");
        leftplayer.addEventListener("onStateChange", "onLeftPlayerStateChange");
        leftplayer.addEventListener("onError", "onLeftPlayerError");
        api_is_ready("left");
    }
    if (playerId == "right") {
        rightplayer = document.getElementById("right");
        rightplayer.addEventListener("onStateChange", "onRightPlayerStateChange");
        rightplayer.addEventListener("onError", "onRightPlayerError");
        api_is_ready("right");
    }
    if (leftplayer != 0 && rightplayer != 0) {
        hide_right();
        //init();
        currentPlayer = 0;
        //play();
    }
}
function init(id1, id2) {
    leftplayer.setVolume(100);
    rightplayer.setVolume(100);
    sast(leftplayer, id1);
    leftplayer.playVideo();
    sast(rightplayer, id2);
    rightplayer.playVideo();
    rightplayer.pauseVideo();
    $(".pl_title[index='0']").css("background-color", "AntiqueWhite");
}
