# Alloy App for android showing Offline map using Leaflet and Maperitive. #

Titanium’s implementation of the Ti.Map object doesn’t support offline maps, so it was obvious to find a third party solution. I chose Leaflet library to display the maps as it has well documented APIs and can be extended with lots of available plugins.
For offline use I have used the Maperitive software on Windows that generates tiles (square map images which, typically get pieced together by the web browser running a javascript library (i. e Leaflet).

## Maperitive ##
Maperitive is a FREE desktop GUI application for drawing maps based on OpenStreetMap and GPS data.You can define what gets on the map and how it is painted. You can also export these maps into bitmaps and SVG files and print them.
### Generating Tiles for a zoom level: ###
We will need to tell Maperitive what area we are interested in.
There are several ways to set the limits. The easiest is to move the map to the area, right-click on the map and choose *Place Geometry Bounds Here* from the context menu. When the red rectangle appears, you can move it and resize it to the area of your choice. By default, Maperitive renders everything you see in the map on your screen if you do not use the rectangular box. But if you are happy with that you can move on or if you want to customise the area to something more specific you can set a bounding box for all your operations by using the command prompt. 

```javascript
set-geo-bounds -0.351468,51.38494,-0.148271,51.672342
```
One easy way to find a bounding box is to use this website  http://boundingbox.klokantech.com/ for finding the bounds of the area. For instance if i had to get the bounds for *London*, I would find that place using the search box and then move the rectangular box to that area, choose *DublinCore* within the *Copy & Paste* option drop-down and it would give  the  co-ordinates as *westlimit=-0.351468; southlimit=51.38494; eastlimit=-0.148271; northlimit=51.672342* for  *London*.

![london12.jpg](https://bitbucket.org/repo/84Xp6e/images/942432459-london12.jpg)

Replace above values accordingly when passing bounds to generating the tiles or to the leaflet library.
Once you know the bounds, execute this command to generate tiles:

```javascript
generate-tiles minzoom=16 maxzoom=18 bounds=-0.351468,51.38494,-0.148271,51.672342
```
where bounds should be in the format *minlng,minlat,maxlng,maxlat.* 

![7-generate-tile.jpg](https://bitbucket.org/repo/84Xp6e/images/2716012887-7-generate-tile.jpg)

The tiles will be generated in a directory named "Tiles" inside of the Maperitive directory. For higher zoom levels it could take a while to generate the tiles.

## This sample Alloy project for Android demonstrates how to: ##
*  set up a map that uses offline tiles 
*  add a filter by creating a custom control
*  plot markers that are read from a sqlite database
*  use the Leaflet Markercluster plugin to handle a lot of markers
*  have the markers show the annotation when clicked


## Deployment targets: ##
* *Ti SDK 5.0.2 GA* 
* *Tested on Google Nexus 10, Sony Z4 tablet for 2560x1600 dimension* 

## Usage: ##
Pick the widget and also the leaflet directory from the assets folder and paste it into your app. 

##### index.xml
```javascript
<Alloy>
	<Window class="container">		
		<View class="parentView">
			<Require type="widget" src="afb.offlineMap" id="map"></Require>
		</View>
	</Window>
</Alloy>
```
 
## Widget Properties: ##
* *borderColor {String}* - Scrollview border color
* *top {Number}* - set top for the parent
* *path {String}* - The path for the map tiles
* *pois {Array}* - Pass this as an array of object along with lat and lon for the markers
* *minZoomLevel {Number}*- The minimum zoom required for the map when it loads
* *maxZoomLevel {Number}*  - The max zoom required for the map
* *bounds {Array}* - [[S, W], [N, E]] Represents a rectangular area of the map usually bottom-left and top-right corners. This can be caculated from Google earth app or http://boundingbox.klokantech.com/
* *center {Array}* - [lat, long ] The center co-ordinates for the map when it loads.
* *initializeSideBar {Boolean}* -   Initialize the sidebar filter with true/false to show/hide.
* *markerClickEnabled {Boolean}* - If the annotations are applied, make sure to enable this property.
* *callback {Function}*  - This function will be called once the map tiles are loaded.
* *optionChangeCallback {Function}* - This function is called when the filters in the sidebar are changed
* *defaultSelectedOption {Number}*  - Mandatory when the sidebar

## Widget Methods: ##
### So each View controller can call a number of below functions:  ###
***init***

```javascript
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
	// ... //
};

```

***setPanTo***

```javascript
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

```
***setPOIs***

```javascript

/**
 * @method setPOIs This function sets pins on the map. Can be used with filters.
 * @param {Object} pois Details like name description and lat, long info about the pin.
 * @return {void}
 */
 
 exports.setPOIs = function(pois) {
	// ... //
};
```
***destroy***

```javascript
/**
 * @method destroy Used for releasing memory
 * @return {void}
 */
 
exports.destroy = function() {
	// ... //
};
```


## Notice ##
This application uses: 

* Leaflet library - [http://leafletjs.com/reference.html](Link URL)
* Maperitive - http://maperitive.net/docs/
* Marker cluster plugin - [https://github.com/Leaflet/Leaflet.markercluster](Link URL)