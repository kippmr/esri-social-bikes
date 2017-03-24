require([
  "esri/Map",
  "esri/layers/FeatureLayer",
  "esri/views/MapView",
  "esri/geometry/geometryEngine",
  "esri/widgets/Locate",
  "esri/widgets/Search",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/tasks/RouteTask",
  "esri/tasks/support/RouteParameters",
  "esri/tasks/support/FeatureSet",
  "esri/core/urlUtils",
  "dojo/on",
  "dojo/domReady!"
], function(
  Map, FeatureLayer, MapView, geometryEngine, Locate, Search, Graphic, GraphicsLayer, 
  RouteTask, urlUtils, 
) {
  window.srclat = 0, window.srclon = 0, window.dstlat = 0, window.dstlon = 0;
  // Create the Map
  var map = new Map({
    basemap: "streets"
  });

  // Create the MapView
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-79.3860, 43.6543],
    zoom: 14
  });

  var locateBtn = new Locate({ view: view});
  var searchWidget = new Search({ view: view});

  view.ui.add(locateBtn, {
    position: "top-left"
  });
  view.ui.add(searchWidget, { 
    position: "top-right",
    index: 0
  });
  searchWidget.on("select-result", function(event){
    console.log("The selected search result: ", event);
  });

  /*************************************************************
  * The PopupTemplate content is the text that appears inside the
  * popup. Bracketed {fieldName} can be used to reference the value
  * of an attribute of the selected feature. HTML elements can be
  * used to provide structure and styles within the content.
  **************************************************************/

  // Add this action to the popup so it is always available in this view
  var srcAction = {
    title: "Source",
    id: "set-src",
    image: "https://cdn1.iconfinder.com/data/icons/your-needs-vol-5/16/location_map_navigation_destination_source-512.png"
  };
  var dstAction = {
    title: "Destination",
    id: "set-dst",
    image: "https://cdn1.iconfinder.com/data/icons/mini-solid-icons-vol-2/16/94-512.png"
  };

  var template = { // autocasts as new PopupTemplate()
    title: "Bicycle Station",
    content: "{name}",
    actions: [srcAction, dstAction],
  };

  featureLayer = new FeatureLayer({
    url: "https://services.arcgis.com/3wgo1qnFL7YLB8lT/arcgis/rest/services/Bixi_Test/FeatureServer/2",
    outFields: ["*"],
    popupTemplate: template
  });
  map.add(featureLayer);

  // Execute each time the "Measure Length" is clicked
  function setSrc() {
    var geom = view.popup.selectedFeature.geometry;
    var distance = geometryEngine.geodesicLength(geom, "miles");
    distance = parseFloat(Math.round(distance * 100) / 100).toFixed(2);
    srclat = view.popup.selectedFeature.attributes.X_cord
    srclon = view.popup.selectedFeature.attributes.Y_cord
    view.popup.content = view.popup.selectedFeature.attributes.name +
    "<div style='background-color:DarkGray;color:white'> Source is set to " + 
    srclat + ", " + srclon + ".</div>";
  }
  function setDst() {
    var geom = view.popup.selectedFeature.geometry;
    var distance = geometryEngine.geodesicLength(geom, "miles");
    distance = parseFloat(Math.round(distance * 100) / 100).toFixed(2);
    dstlat = view.popup.selectedFeature.attributes.X_cord
    dstlon = view.popup.selectedFeature.attributes.Y_cord
    view.popup.content = view.popup.selectedFeature.attributes.name +
    "<div style='background-color:DarkGray;color:white'> Destination is set to " + 
    dstlat + ", " + dstlon + ".</div>";
  }

  // Event handler that fires each time an action is clicked.
  view.popup.on("trigger-action", function(event) {
    // Execute the measureThis() function if the measure-this action is clicked
    if (event.action.id == "set-src") {
      setSrc();
    } else if (event.action.id == "set-dst") {
      setDst();
    }
  });

  /*************************************************************
  * Plot route based on src and dst's lat and lon.
  **************************************************************
  // Point the URL to a valid route service
  var routeTask = new RouteTask({
    url: "https://services.arcgis.com/3wgo1qnFL7YLB8lT/arcgis/rest/services/Bixi_Test/FeatureServer/0"
  });
  var routeLyr = new GraphicsLayer(); //where route will be stored
  //route parameters
  var routeParams = new RouteParameters({
    stops: new FeatureSet(),
    outSpatialReference: { // autocasts as new SpatialReference()
      wkid: 3857
    }
  });
  // Define the symbology used to display the route
  var routeSymbol = new SimpleLineSymbol({
    color: [0, 0, 255, 0.5],
    width: 5
  });**/
});