#Social Bikes:
##An ESRI App Challenge 2017 Entry
**Team Members**

* Matthew Kipp
* Sean Leipe
* Wei Lu
* Jack You

**Purpose**: To compliment the [Bike Share](https://www.bikesharetoronto.com/) program present in the City of Toronto by determining routes between bike hubs using only bike-friendly routes (no Gardiner Expressway!). As of creation of this app, the [bike share website](https://member.bikesharetoronto.com/stations) only displays available hubs. 

In particular, the app will display available bike hubs, where the user will select the start and end bike hub, have a route automatically generated, and display the distance of the generated route.

**Access Instructions**:

The app is available via web browser at [kippmr.com/esri-social-bike](http://www.kippmr.com/esri-social-bikes/) and operates on mobile and desktop devices.

##Data Sources:
* [Toronto Bike Share Hub Data](https://feeds.bikesharetoronto.com/stations/stations.xml)
* [Toronto Bikeway Network](http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=9ecd5f9cd70bb210VgnVCM1000003dd60f89RCRD&vgnextchannel=1a66e03bb8d1e310VgnVCM10000071d60f89RCRD)
* [Toronto Ward Shapefile](http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=71d9c7e6e34b6410VgnVCM10000071d60f89RCRD)
* [Canadian Water Bodies Shapefile](http://geogratis.gc.ca/api/en/nrcan-rncan/ess-sst/87066e9a-94ee-680a-b1ba-591f4688db7d.html)

##Limits and Assumptions
* Assumes that the bicycle count at a bike hub is always greater than zero due to working with static data, which leads to a limitation that the app is unable to report the correct number of bicycles at a bike hub. Solution: use dynamic data provided by Toronto rather than static.
* The app currently operates in the Downtown Toronto / East York area due to the limitation of Bike Share Toronto bike hubs placed throughout the city. Solution: the application will update once more bike hubs are installed and recorded.
