require([
      "esri/Map",
      "esri/views/MapView",
      "esri/widgets/Locate",
      "esri/widgets/Search",
      "esri/layers/FeatureLayer",
      "dojo/domReady!"
    ], function(
      Map, MapView, Locate, Search, FeatureLayer
    ) {
      var map = new Map({
        basemap: "streets",
      });

      var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-79.3860, 43.6543],
        zoom: 14
      });

      var locateBtn = new Locate({
        view: view
      });

      // Add the locate widget to the top left corner of the view
      view.ui.add(locateBtn, {
        position: "top-left"
      });

      var searchWidget = new Search({
        view: view
      });

      // Add the search widget to the very top left corner of the view
      view.ui.add(searchWidget, {
        position: "top-right",
        index: 0
      });

      searchWidget.on("select-result", function(event){
        console.log("The selected search result: ", event);
      });

      // Carbon storage of trees in Warren Wilson College.
      var featureLayer = new FeatureLayer({
        url: "https://services.arcgis.com/3wgo1qnFL7YLB8lT/arcgis/rest/services/Bixi/FeatureServer/2"
      });

      map.add(featureLayer);

      view.on("click", function(evt){
        var screenPoint = {
          x: evt.x,
          y: evt.y
        };
        view.hitTest(screenPoint)
          .then(function(response){
             // do something with the result graphic
             console.log(response);
             console.log("clicked");
             var graphic = response.results[0].graphic;
          });
    });
    });
