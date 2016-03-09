function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "afb.offlineMap/" + s : s.substring(0, index) + "/afb.offlineMap/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

module.exports = [ {
    isApi: true,
    priority: 1000.0001,
    key: "Label",
    style: {
        color: "#000",
        font: {
            fontSize: 18,
            fontWeight: "bold"
        },
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE
    }
}, {
    isId: true,
    priority: 100000.0002,
    key: "scrollViewMap",
    style: {
        url: "/leaflet/map.html",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL
    }
} ];