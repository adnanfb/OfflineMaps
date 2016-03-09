/* exported loadAndroidMap */

/**
 * This widget takes in the offline map tiles and shows them in a webview using leaflet.js library (Currently supports Android).
 * @author Adnan Baliwala
 * @class kew.widgets.OfflineMaps
 */

/* exported setCurrentPosition, setPOIs */

"use strict";
/*
 * TODO Need to check if these vars need to made global
 */
var selectedOption,
    points,    
    minZoomLevel,
    maxZoomLevel,
    bounds,
    center,
    initializeSideBar,
    markerClickEnabled,
    callback,
    optionChangeCallback,
    defaultSelectedOption,
    path;

/**
 * @event poiClick This is the click handler for a pin
 */
/* jshint ignore:start */
function poiClick(e) {
	Ti.API.info("POI CLICK: " + JSON.stringify(e.source.poi));
}

/* jshint ignore:end */

/**
 * @method doPois Fire ti event in order to pass points from controller to html.
 * points - widget level variable.
 */

function doPois() {
	Ti.App.fireEvent("app:addPoints", {
		points : points
	});
}

/**
 * @method loadAndroidMap Called when the webview finishes loading and sends the required params to the map.html file.
 * @return {void}
 */
function loadAndroidMap() {

	var obj = {
		//path : Ti.Filesystem.getFile(Alloy.Globals.dataFolder).nativePath,		
		pois : points,
		center : center,
		stops : "",
		bounds : bounds,
		path : path,
		minZoomLevel : minZoomLevel,
		maxZoomLevel : maxZoomLevel,
		markerClickEnabled : markerClickEnabled,
		initializeSideBar : initializeSideBar,
		defaultSelectedOption : defaultSelectedOption
	};
	Ti.API.info('startWebview: ' + JSON.stringify(obj));

	Ti.App.fireEvent("app:startWebview", obj);

}

/**
 * @method init Initialises the global variables that are needed for the map and tiles.
 * @param {Object} _args required params for the map and tile constructor
 *  * ** Object info **
 * -  borderColor {String} Scrollview border color
 * -  path {String} The path for the map tiles 
 * -  pois {Array} - Details like name description and lat, long info about the pin.
 * -  minZoomLevel {Number} - The minimum zoom required for the map when it loads
 * -  maxZoomLevel {Number} - The max zoom required for the map
 * -  bounds {Array} - [[S, W], [N, E]] Represents a rectangular area of the map usually bottom-left and top-right corners. This can be caculated from Google earth app or http://boundingbox.klokantech.com/
 * -  initializeSideBar {Boolean}  Initialize the sidebar with true/false to show/hide.
 * -  markerClickEnabled {Boolean} If the annotations are applied, make sure to enable this property.
 * -  center {Array} - [lat, long ] The center co-ordinates for the map when it loads.
 * @return {void}
 */
$.init = function(_args) {

	if (!_.isEmpty(_args)) {

		if (_args.borderColor) {
			$.scrollViewMap.borderColor = _args.borderColor;
		}

		if (_args.top) {
			$.scrollViewMap.top = _args.top;
		}

		if (_args.path) {
			path = _args.path;
		}
		
		if (_args.pois) {
			points = _args.pois;
		}
						
		if (_args.minZoomLevel) {
			minZoomLevel = _args.minZoomLevel;
		}

		if (_args.maxZoomLevel) {
			maxZoomLevel = _args.maxZoomLevel;
		}

		if (_args.bounds) {
			bounds = _args.bounds;
		}

		if (_args.center) {
			center = _args.center;
		}
		if (_args.initializeSideBar) {
			initializeSideBar = _args.initializeSideBar;
		}
		if (_args.markerClickEnabled) {
			markerClickEnabled = _args.markerClickEnabled;
		}
		if (_args.callback) {
			callback = _args.callback;
		}
		if (_args.optionChangeCallback) {
			optionChangeCallback = _args.optionChangeCallback;
		}
		if (_args.defaultSelectedOption) {
			defaultSelectedOption = _args.defaultSelectedOption;
		}
		Ti.API.info('recieved init props --> ' + JSON.stringify(_args));
	}
};

function loadFinishCallback() {
	if (callback) {
		callback();
	}
}

Ti.App.addEventListener("app:mapDidFinishLoading", loadFinishCallback);

/**
 * @method setPOIs This function sets pins on the map. Can be used with filters.
 * @param {Object} pois Details like name description and lat, long info about the pin.
 * @return {void}
 */
exports.setPOIs = function(pois) {
	points = pois;
	doPois();
};

function _optionChange(e) {
	selectedOption = JSON.parse(e.selectedOption);
	if (optionChangeCallback) {
		optionChangeCallback(selectedOption);
	}
};

Ti.App.addEventListener("app:getResults", _optionChange);

/**
 * @method setPanTo This function sets pins to the center by panning the map
 * @param {Object} pois the object should have lat and lon of the pin for the panning to work.
 * @return {void}
 */
exports.setPanTo = function(poi) {
	Ti.App.fireEvent("app:setPanTo", {
		poi : poi
	});
};

/**
 * @method destroy Used for releasing memory
 * @return {void}
 */
exports.destroy = function() {
	Ti.API.info('map widget destroyed!');
	Ti.App.removeEventListener("app:mapDidFinishLoading", loadFinishCallback);
	$.scrollViewMap = null;
};
