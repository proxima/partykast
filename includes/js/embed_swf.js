var flashvars = {};
var params = { allowScriptAccess: "always" };
params.wmode = "transparent";

var l_attr = { id: "left" };
var r_attr = { id: "right" };

var width = 2163;
var height = 1000;
$(document).ready(function () {
    var id1 = $(".pl_title[index='0']").attr("id");
    var id2 = $(".pl_title[index='1']").attr("id");
    swfobject.embedSWF("http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=left", "ytapiplayer1", width, height, "8", null, null, params, l_attr);
    swfobject.embedSWF("http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=right", "ytapiplayer2", width, height, "8", null, null, params, r_attr);
});
