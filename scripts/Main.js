require([
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer",
      "esri/tasks/RouteTask",
      "esri/tasks/support/RouteParameters",
      "esri/tasks/support/FeatureSet",
      "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/Color",
      "esri/core/urlUtils",
      "dojo/on",
      "dojo/domReady!"
    ], function(
      Map, MapView, Graphic, GraphicsLayer, RouteTask, RouteParameters,
      FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol, Color, urlUtils, on
    ) {

      // Point the URL to a valid route service
      var routeTask = new RouteTask({
        url: "https://services.arcgis.com/3wgo1qnFL7YLB8lT/arcgis/rest/services/Bixi_Test/FeatureServer/0"
      });

      // The stops and route result will be stored in this layer
      var routeLyr = new GraphicsLayer();

      // Setup the route parameters
      var routeParams = new RouteParameters({
        stops: new FeatureSet(),
        outSpatialReference: { // autocasts as new SpatialReference()
          wkid: 3857
        }
      });

      // Define the symbology used to display the stops
      var stopSymbol = new SimpleMarkerSymbol({
        style: "cross",
        size: 15,
        outline: { // autocasts as new SimpleLineSymbol()
          width: 4
        }
      });

      // Define the symbology used to display the route
      var routeSymbol = new SimpleLineSymbol({
        color: [0, 0, 255, 0.5],
        width: 5
      });

      var map = new Map({
        basemap: "streets",
        layers: [routeLyr] // Add the route layer to the map
      });
      var view = new MapView({
        container: "viewDiv", // Reference to the scene div created in step 5
        map: map, // Reference to the map object created before the scene
    center: [-79.3860, 43.6543],
    zoom: 14
      });

      // Adds a graphic when the user clicks the map. If 2 or more points exist, route is solved.
      on(view, "click", addStop);

      function addStop(event) {
        // Add a point at the location of the map click
        var stop = new Graphic({
          geometry: event.mapPoint,
          symbol: stopSymbol
        });
        routeLyr.add(stop);

        // Execute the route task if 2 or more stops are input
        routeParams.stops.features.push(stop);
        if (routeParams.stops.features.length >= 2) {
          routeTask.solve(routeParams).then(showRoute);
        }
      }
      // Adds the solved route to the map as a graphic
      function showRoute(data) {
        var routeResult = data.routeResults[0].route;
        routeResult.symbol = routeSymbol;
        routeLyr.add(routeResult);
      }
    });