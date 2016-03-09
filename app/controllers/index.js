var dbLib = require('db').methods;
var defaultOption = 2; // For All filter as default selected. 

function mapDidFinishLoading() {
	Ti.API.info("all visible tiles have been loaded");	
	// Uncomment this function if no sidebar filters are needed and To get 'All' markers by default when filter sidebar is disabled
	 getMarkers(1); 	 
}

function init(){
					
	$.map.init({
		"borderColor" : "none",
		"top" : 0,
		"bottom" : 0,				
		"minZoomLevel" : 16,
		"maxZoomLevel" : 18,
		"pois" : [],
		"center":  [51.478744, -0.295573],
		"bounds" : [[51.470103, -0.310407], [51.486674, -0.286572]],
		"path" : "richmond",
		"initializeSideBar" : true, 
		"markerClickEnabled" : true,
		"defaultSelectedOption" : defaultOption, // (optional, 0 means first option, manadatory if initializeSideBar is true)
		"callback" : mapDidFinishLoading,
		"optionChangeCallback" : function(defaultOption){
			// defaultOption - this is the returned selected filter index from the widget.
			return getMarkers(defaultOption);	
		}
	});		 
	
}
 
function getMarkers(option){
	Ti.API.info('selected option is ' 	+ JSON.stringify(option));	 
	function getMarkersSuccess(payload){
		Ti.API.info('getMarkersSuccess: ' 	+ JSON.stringify(payload));
		$.map.setPOIs(payload);
	}

	function getMarkersError(payload){
		Ti.API.info('getAllError: ' + JSON.stringify(payload));
			$.map.setPOIs([]);
	}	
	
	dbLib.getMarkers(getMarkersSuccess, getMarkersError, {		
		condition:option 
	});	
}

init();

$.index.open();

