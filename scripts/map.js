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
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/renderers/SimpleRenderer",
  "esri/Color",
  "esri/core/urlUtils",
  "dojo/domReady!"
], function(
  Map, FeatureLayer, MapView, geometryEngine, Locate, Search, Graphic, GraphicsLayer, 
  RouteTask, RouteParameters, FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol, SimpleRenderer, Color, 
  urlUtils, on
) {
  window.srclat = 0, window.srclon = 0, window.dstlat = 0, window.dstlon = 0, window.DST = null, window.SRC = null;

  var routeLyr = new GraphicsLayer(); //where route will be stored
  // Create the Map
  var map = new Map({
    basemap: "streets",
    layers: [routeLyr] // Add the route layer to the map
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
  var linesRenderer = new SimpleRenderer({
    symbol: new SimpleLineSymbol({
      width: "2px",
      color: "black",
      style: "short-dash-dot-dot"
    })
  });
  var pointsRenderer = new SimpleRenderer({
    symbol: new SimpleMarkerSymbol({
      size: 10,
      color: [0,127,255, 0.8],
      style: "diamond"
    })
  });
  featureLayer = new FeatureLayer({
    url: "https://services.arcgis.com/3wgo1qnFL7YLB8lT/arcgis/rest/services/Bixi_Test/FeatureServer/2",
    outFields: ["*"],
    popupTemplate: template,
    renderer: pointsRenderer
  });
  map.add(featureLayer);
  featureLayer2 = new FeatureLayer({
    url: "https://services.arcgis.com/3wgo1qnFL7YLB8lT/arcgis/rest/services/Bixi_Test/FeatureServer/3",
    outFields: ["*"],
    renderer: linesRenderer
    //opacity: 0.2
  });
  map.add(featureLayer2);

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
    window.SRC = view.popup.location
    calcRoute();
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
    window.DST = view.popup.location;
    calcRoute();
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
  **************************************************************/
  // Point the URL to a valid route service
  var routeTask = new RouteTask({
    url: "https://utility.arcgis.com/usrsvcs/servers/0d7cf5c7a6954ea8b64faa37b7d3b750/rest/services/World/Route/NAServer/Route_World"
  });
  //route parameters
  /*var routeParams = new RouteParameters({
    stops: new FeatureSet(),
    outSpatialReference: { // autocasts as new SpatialReference()
      wkid: 3857
    }
  });*/
  // Define the symbology used to display the route
  var routeSymbol = new SimpleLineSymbol({
    color: [0, 0, 255, 0.5],
    width: 5
  });
  // Define the symbology used to display the stops
  var stopSymbol = new SimpleMarkerSymbol({
    style: "cross",
    size: 15,
    outline: { // autocasts as new SimpleLineSymbol()
      width: 4
    }
  });
  function calcRoute() {
    if (DST != null && SRC != null) {
      routeLyr.removeAll();
     var routeParams = new RouteParameters({
    stops: new FeatureSet(),
    outSpatialReference: { // autocasts as new SpatialReference()
      wkid: 3857
    }
  });    
      var stop1 = new Graphic({
        geometry: SRC,
        symbol: stopSymbol
      });
      var stop2 = new Graphic({
        geometry: DST,
        symbol: stopSymbol
      });
      routeParams.stops.features.push(stop1);
      routeParams.stops.features.push(stop2);
      // Add a point at the location of the map click

      routeLyr.add(stop1);
      routeLyr.add(stop2);
      //execute route
      routeTask.solve(routeParams).then(showRoute);
    }
  }

  // Adds the solved route to the map as a graphic
  function showRoute(data) {
      console.log("WE MADEIT");
    var routeResult = data.routeResults[0].route;
    routeResult.symbol = routeSymbol;
    routeLyr.add(routeResult);
  }
});