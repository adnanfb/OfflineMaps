function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "afb.offlineMap/" + s : s.substring(0, index) + "/afb.offlineMap/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function doPois() {
        Ti.App.fireEvent("app:addPoints", {
            points: points
        });
    }
    function loadAndroidMap() {
        var obj = {
            pois: points,
            center: center,
            stops: "",
            bounds: bounds,
            path: path,
            minZoomLevel: minZoomLevel,
            maxZoomLevel: maxZoomLevel,
            markerClickEnabled: markerClickEnabled,
            initializeSideBar: initializeSideBar,
            defaultSelectedOption: defaultSelectedOption
        };
        Ti.API.info("startWebview: " + JSON.stringify(obj));
        Ti.App.fireEvent("app:startWebview", obj);
    }
    function loadFinishCallback() {
        callback && callback();
    }
    function _optionChange(e) {
        selectedOption = JSON.parse(e.selectedOption);
        optionChangeCallback && optionChangeCallback(selectedOption);
    }
    new (require("alloy/widget"))("afb.offlineMap");
    this.__widgetId = "afb.offlineMap";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.scrollViewMap = Ti.UI.createWebView({
        url: "/leaflet/map.html",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "scrollViewMap"
    });
    $.__views.scrollViewMap && $.addTopLevelView($.__views.scrollViewMap);
    loadAndroidMap ? $.addListener($.__views.scrollViewMap, "load", loadAndroidMap) : __defers["$.__views.scrollViewMap!load!loadAndroidMap"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    "use strict";
    var selectedOption, points, minZoomLevel, maxZoomLevel, bounds, center, initializeSideBar, markerClickEnabled, callback, optionChangeCallback, defaultSelectedOption, path;
    $.init = function(_args) {
        if (!_.isEmpty(_args)) {
            _args.borderColor && ($.scrollViewMap.borderColor = _args.borderColor);
            _args.top && ($.scrollViewMap.top = _args.top);
            _args.path && (path = _args.path);
            _args.pois && (points = _args.pois);
            _args.minZoomLevel && (minZoomLevel = _args.minZoomLevel);
            _args.maxZoomLevel && (maxZoomLevel = _args.maxZoomLevel);
            _args.bounds && (bounds = _args.bounds);
            _args.center && (center = _args.center);
            _args.initializeSideBar && (initializeSideBar = _args.initializeSideBar);
            _args.markerClickEnabled && (markerClickEnabled = _args.markerClickEnabled);
            _args.callback && (callback = _args.callback);
            _args.optionChangeCallback && (optionChangeCallback = _args.optionChangeCallback);
            _args.defaultSelectedOption && (defaultSelectedOption = _args.defaultSelectedOption);
            Ti.API.info("recieved init props --> " + JSON.stringify(_args));
        }
    };
    Ti.App.addEventListener("app:mapDidFinishLoading", loadFinishCallback);
    exports.setPOIs = function(pois) {
        points = pois;
        doPois();
    };
    Ti.App.addEventListener("app:getResults", _optionChange);
    exports.setPanTo = function(poi) {
        Ti.App.fireEvent("app:setPanTo", {
            poi: poi
        });
    };
    exports.destroy = function() {
        Ti.API.info("map widget destroyed!");
        Ti.App.removeEventListener("app:mapDidFinishLoading", loadFinishCallback);
        $.scrollViewMap = null;
    };
    __defers["$.__views.scrollViewMap!load!loadAndroidMap"] && $.addListener($.__views.scrollViewMap, "load", loadAndroidMap);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;