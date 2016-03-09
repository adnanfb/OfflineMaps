function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function mapDidFinishLoading() {
        Ti.API.info("all visible tiles have been loaded");
        getMarkers(1);
    }
    function init() {
        $.map.init({
            borderColor: "none",
            top: 0,
            bottom: 0,
            minZoomLevel: 16,
            maxZoomLevel: 18,
            pois: [],
            center: [ 51.478744, -.295573 ],
            bounds: [ [ 51.470103, -.310407 ], [ 51.486674, -.286572 ] ],
            path: "richmond",
            initializeSideBar: true,
            markerClickEnabled: true,
            defaultSelectedOption: defaultOption,
            callback: mapDidFinishLoading,
            optionChangeCallback: function(defaultOption) {
                return getMarkers(defaultOption);
            }
        });
    }
    function getMarkers(option) {
        function getMarkersSuccess(payload) {
            Ti.API.info("getMarkersSuccess: " + JSON.stringify(payload));
            $.map.setPOIs(payload);
        }
        function getMarkersError(payload) {
            Ti.API.info("getAllError: " + JSON.stringify(payload));
            $.map.setPOIs([]);
        }
        Ti.API.info("selected option is " + JSON.stringify(option));
        dbLib.getMarkers(getMarkersSuccess, getMarkersError, {
            condition: option
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createView({
        borderColor: "#000000",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "__alloyId0"
    });
    $.__views.index.add($.__views.__alloyId0);
    $.__views.map = Alloy.createWidget("afb.offlineMap", "widget", {
        id: "map",
        __parentSymbol: $.__views.__alloyId0
    });
    $.__views.map.setParent($.__views.__alloyId0);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var dbLib = require("db").methods;
    var defaultOption = 2;
    init();
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;