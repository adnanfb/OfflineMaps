# Creating Offline maps with Leaflet and Maperitive. #

Titanium’s implementation of the Ti.Map object doesn’t support offline maps, so it was obvious to find a third party solution. I chose Leaflet library to display the maps as it has well documented APIs and can be extended with lots of available plugins.
For offline use I have used the Maperitive software on Windows that generates tiles (square map images which, typically get pieced together by the web browser running a javascript library (i. e Leaflet).

## Maperitive ##
Maperitive is a FREE desktop GUI application for drawing maps based on OpenStreetMap and GPS data.You can define what gets on the map and how it is painted. You can also export these maps into bitmaps and SVG files and print them.
### Generating Tiles for a zoom level: ###
We will need to tell Maperitive what area we are interested in.
There are several ways to set the limits. The easiest is to move the map to the area, right-click on the map and choose Place Geometry Bounds Here from the context menu. When the red rectangle appears, you can move it and resize it to the area of your choice. By default, Maperitive renders everything you see in the map on your screen if you do not use the rectangular box. But if you are happy with that you can move on or if you want to customise the area to something more specific you can set a bounding box for all your operations by using the command prompt. One easy way to find a bounding box is to use

this website  http://boundingbox.klokantech.com/ for finding the bounds of the area. For instance if i had to get the bounds for London, i would find that place using the search box and then move the rectangular box to that area, choose DublinCore within the Copy & Paste option drop-down and it would give  the  co-ordinates as westlimit=-0.20256; southlimit=51.462334; eastlimit=-0.014345; northlimit=51.545054 for a small area of London. Replace this values accordingly when passing bounds to generating the tiles or to the leaflet library.
Once you know the bounds, execute this command to generate tiles:
generate-tiles minzoom=16 maxzoom=18 bounds=-0.20256,51.462334,-0.014345,51.545054
where bounds should be in minlng,minlat,maxlng,maxlat format.

The **Intrepid Mobile App** is a Titanium Appcelerator cross platform app targetting iOS & Android.

### How do I get set up? ###
#### Prerequisites
* Appcelerator Platform License
* Installed Appcelerator Studio including SDK for both iOS and Android

To find out more about the Appcelerator Platform visit: http://docs.appcelerator.com/platform/latest/#!/guide/Quick_Start

* Check out this repository
* Run app from within Appcelerator Studio
<br/>NB: You may need to set up a new project on your licensed version of the Appcelerator Platform and then change the Keys within TiApp.xml in order to run this app.

### Architecture ###
![Intrepid Mobile App Architecture](Intrepid-App-Architecture.jpeg)

This app makes use of the 5.0.0.beta SDK from Appcelerator along with Appcelerator's MVC framework Alloy which should allow any Appcelerator Titanium developer to pick up and understand the app with relative ease.  

One key point to note is that this app has been set up with an architecture to make creation and management of windows easier whilst making use of the native UI experience on both iOS and Android mobile operating systems. This is illustrated in the architecture diagram where iOS makes use of the [Navigation Window UI](http://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.NavigationWindow) whilst Android uses the [ActionBar UI](http://docs.appcelerator.com/platform/latest/#!/api/Titanium.Android.ActionBar).

When creating new Alloy Controllers they should **NOT** have a *Window* XML tag because WindowHelper.js handles this.

To open a window using WindowHelper.js you simply call openWindow passing in the UI View Controller e.g:

```javascript
    win.openWindow({ui:"overview/index"});
```

Each View controller can call a number of export functions to configure window specifics

##### setWin

```javascript
    /*
     * Define this if you need a reference to the current window object.
     * If you want to open/close a window or update the Android actionbar share text, you want to do this. See note above.
     */
    exports.setWin = function(parent)
    {
        win = parent;
    };
```

##### getLeftNavWinButtons

```javascript
/*
 * iOS specific.
 * Return the left navigation window button here if you want to set one (or multiple ones).
 */
exports.getLeftNavWinButtons = function()
{
    if (!leftNavButton)
    {
        leftNavButton = NavWinButtonHelper.createShareButton({callback:leftNavWinButtonPressed});
        leftNavButton.backgroundColor = "blue";
    }

    return [leftNavButton];
};
```


##### getRightNavWinButtons

```javascript
/*
 * iOS specific.
 * Return the right navigation window button here if you want to set one (or multiple ones).
 */
exports.getRightNavWinButtons = function()
{
    if (!rightNavButton)
    {
        rightNavButton = NavWinButtonHelper.createShareButton({callback:rightNavWinButtonPressed});
    }

    return [rightNavButton];
};
```

##### showABXShare

```javascript
/*
 * Android specific.
 * Set true if you want share options to show in the top right hand corner of the actionbar.
 * If set to true, you MUST provide "shareText" property inside the getABXInitParams function!
 */
exports.showABXShare = true;
```

##### getABXInitParams

```javascript
/*
 * Android specific.
 * Define the actionbar title, subtitle and sharetext.
 */
exports.getABXInitParams = function()
{
    return {
        title:"App name here",
        subtitle:"Random Form",
        shareText:"My awesome share text!"
    };
};
```

##### onABXHomeIconPressed

```javascript
/*
 * Android specific.
 * Event called when the actionbar home icon is pressed.
 */
exports.onABXHomeIconPressed = function()
{
    Logger.print("onABXHomeIconPressed");
};
```

##### onWinOpen

```javascript
/*
 * Event called when window is opened.
 */
exports.onWinOpen = function(e)
{
    Logger.print("onWinOpen form UI");
};
```

##### onWinClose

```javascript
/*
 * Event called when window is about to be closed.
 */
exports.onWinClose = function(e)
{
    Logger.print("onWinClose form UI");
};
```

##### onWinFocus

```javascript
/*
 * Event called when window receives focus.
 */
exports.onWinFocus = function(e)
{
    Logger.print("onWinFocus form UI");
};
```

##### onWinInit

```javascript
/*
 * Event called when window is about to be initialised.
 * Set any custom options here that you want to apply to the Ti.UI.Window object.
 */
exports.onWinInit = function()
{
    Logger.print("onWinInit form UI");

    var options = {
        title:"Register"
    };

    if (OS_ANDROID)
    {
        options.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_STATE_HIDDEN;
    }

    return options;
};
```

##### leftNavWinButtonPressed

```javascript
/*
 * The callback you set when creating the left navigation window button.
 * You can rename this to whatever you pass into the callback parameter for NavWinButtonHelper.
 * See getLeftNavWinButtons function.
 */
function leftNavWinButtonPressed(e)
{
    alert("left nav win button pressed");
}
```

##### rightNavWinButtonPressed

```javascript
/*
 * The callback you set when creating the right navigation window button.
 * You can rename this to whatever you pass into the callback parameter for NavWinButtonHelper.
 * See getRightNavWinButtons function.
 */
function rightNavWinButtonPressed(e)
{
    alert("right nav win button pressed");
}
```

### Android Theme ###

As mentioned this single codebase delivers platform specific native experiences for both iOS and Android, the key difference being the use of a NavigationWindow for iOS and ActionBar for Android.

Whilst Titanium supports theming iOS apps in the main by using TSS (similar to CSS) Android additionally requires the use of a native theme to complete the styling and window animations. This custom Android theme can be found in the 'platform/res/' folder.

For more information on Android themes visit http://docs.appcelerator.com/platform/latest/#!/guide/Android_Themes


### API & Data ###

This app uses:

* Alloy Models http://docs.appcelerator.com/platform/latest/#!/guide/Alloy_Models
* Databinding http://docs.appcelerator.com/platform/latest/#!/guide/Alloy_Data_Binding
* SQLRest Adapter https://github.com/viezel/napp.alloy.adapter.restsql  

to communicate with API middleware, bind data to views and store cached data in a SQLite database on the device.

To use Alloy Models & Databinding

* Create Alloy Model file, an example *User* model is in the *models* folder
* Add XML Collection tag to View controller

```html
<Collection src="user"/>
```

* Add dataCollection to repeating UI element

```html
<TableView id="tableView" dataCollection="user">
```

* Use databinding {} brackets on model properties

```html
<TableViewRow title="{username}"/>
```

You can see a full example in '/sample/tableViewScreen' controller complete with Pull To Refresh using the nl.fokkezb.pullToRefresh widget

Alloy Models are built on top of Backbone.js though it is important to note that Titanium has a specific backbone implementation and is not always in line with the latest version. http://docs.appcelerator.com/platform/latest/#!/guide/Alloy_Backbone_Migration

### Localisation ###

This app uses a strings.xml file in the i18n folder to provide language translations where appropriate.

For more information visit http://docs.appcelerator.com/platform/latest/#!/guide/Internationalization

### Modules & Widgets ###

This app uses a number of Modules and Widgets for both iOS and Android which are documented below.

#### com.obscure.keychain ####
The keychain module provides a method of encrypting data on the mobile device so that any sensitive information can be secured. This module supports both iOS and Android and we use to encrypt some basic user information such as the bookingID and Surname combination that uniquely identifies a booking.

Git repo: https://github.com/pegli/ti_keychain


#### nl.fokkezb.html2as.widget ####

Native mobile apps support for HTML tags is limited. Using the Attributed String support http://docs.appcelerator.com/platform/latest/#!/guide/Attributed_Strings this module provides a cross platform way to enable some support for basic HTML tags and format the text the Intrepid API provides a little better.

Git repo: https://github.com/FokkeZB/nl.fokkezb.html2as.widget

#### dk.napp.social ####

This module is for iOS only and is used to allow the user to share natively from within the mobile app. On Android we use the native Intents to provide sharing functionality which is why this is iOS only. http://docs.appcelerator.com/platform/latest/#!/guide/Android_Intents

Git repo: https://github.com/viezel/TiSocial.Framework

#### it.caffeina.gm ####

Appcelerator only supports 'RegisterForPushNotifications' for iOS and Windows by default
http://docs.appcelerator.com/platform/latest/#!/api/Titanium.Network-method-registerForPushNotifications

This Android only module adds equivalent support for Android which is wrapped in the push.js lib file

Git repo: https://github.com/CaffeinaLab/GCM/tree/master/android

#### ti.ga ####

A module that provides a wrapper for the Google Analytics SDK for both iOS and Android. Simply allows tracking of app Analytics to Google. Two types of tracking are used within the App.

** Screens **
```javascript
Alloy.Globals.tracker.addScreenView("Itinerary: Map");
```

** Events **
```javascript
Alloy.Globals.tracker.addEvent({
    category:"TIF",
    label:"Opened TIF Website",
    action:"Opened TIF Website",
    value:1
});
```


Git repo: https://github.com/benbahrenburg/Ti.GA

#### com.alcoapps.actionbarextras ####

In order to provide a native experience on Android this app uses an ActionBar http://docs.appcelerator.com/platform/latest/#!/api/Titanium.Android.ActionBar

This module enhances the basic ActionBar support of Titanium allowing for more control of this native element.

Git repo: https://github.com/ricardoalcocer/actionbarextras

#### com.mattmcfarland.fontawesome ####

This app has FontAwesome integration, this will allow for the use of FontIcons in most areas of the app.

To use FontAwesome simply include the Widget at the bottom of your View XML e.g.

```html
<Widget id="fa" src="com.mattmcfarland.fontawesome"/>
```

Then use Labels for Icons with the FontAwesome codes from http://fontawesome.io/icons/ e.g.

```html
<Label id="iconLabel" left="100" icon="fa-thumbs-o-up"/>
```

Please note there are a few exceptions e.g. you cannot use Font Icons in *NavigationWindows* or *TabGroups*

Git repo: https://github.com/MattMcFarland/com.mattmcfarland.fontawesome




### Chat & Push Notifications ###

The chat functionality uses PubNub as a backend service. 

Push notifications are also sent via PubNub. On Android, we send/receive push notifications using GCM (Google Cloud Messaging), iOS uses APN (Apple Push Notifications). 

Push notifications on Android are relatively easy. All that's required is an API key, which can be created from the following website: https://developers.google.com/cloud-messaging/

On iOS, it's a bit more involved, you have to create appropriate certificates via iTunes Connect and build the app using the correct provisioning profile: https://itunesconnect.apple.com/