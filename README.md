# Creating Offline maps with Leaflet and Maperitive. #

Titanium’s implementation of the Ti.Map object doesn’t support offline maps, so it was obvious to find a third party solution. I chose Leaflet library to display the maps as it has well documented APIs and can be extended with lots of available plugins.
For offline use I have used the Maperitive software on Windows that generates tiles (square map images which, typically get pieced together by the web browser running a javascript library (i. e Leaflet).

## Maperitive ##
Maperitive is a FREE desktop GUI application for drawing maps based on OpenStreetMap and GPS data.You can define what gets on the map and how it is painted. You can also export these maps into bitmaps and SVG files and print them.
### Generating Tiles for a zoom level: ###
We will need to tell Maperitive what area we are interested in.
There are several ways to set the limits. The easiest is to move the map to the area, right-click on the map and choose *Place Geometry Bounds Here* from the context menu. When the red rectangle appears, you can move it and resize it to the area of your choice. 
<br/>By default, Maperitive renders everything you see in the map on your screen if you do not use the rectangular box. But if you are happy with that you can move on or if you want to customise the area to something more specific you can set a bounding box for all your operations by using the command prompt. 

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

## Use: ##
Pick the widget and also the leaflet directory from the assets folder and paste it into your app. Built using Ti SDK 5.0.2 GA, tested on Google Nexus 10, Sony Z4 tablet for 2560x1600 dimension.

## Example: ##
```javascript
// Show sample code here
```
## Properties: ##
```javascript
// Define property descriptions here
```
## Widget Methods: ##
```javascript
// Define method descriptions
```