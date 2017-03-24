Social Bikes:
=============
A 2017 ECCE App Challenge Entry
-------------------------------
**Team Members**

* Matthew Kipp
* Sean Leipe
* Wei Lu
* Jack You

**Purpose**: To compliment the [Bike Share](https://www.bikesharetoronto.com/) program present in the City of Toronto by determining routes between bike hubs using only bike-friendly routes (no highways). As of the 24th of March, the [bike share website](https://member.bikesharetoronto.com/stations) only displays available hubs. 

In particular, the app will display all available bike hubs, where the user will select the start and end hubs, have a route automatically generated on bike-friendly paths giving higher priority to bikeways, and display the distance of the generated route.

**Usage Instructions**:

The app is available via web browser at [kippmr.com/esri-social-bike](http://www.kippmr.com/esri-social-bikes/) and operates on mobile and desktop devices.
Instructional video on using the app: [Using Social Bikes for Biking Around Toronto](https://youtu.be/3iMuzuwukKc)

App Characteristics:
--------------------
Our app contains the location of all the Toronto Bike Share hubs in the available area along with basic information like hub name and capacity, found through Toronto Bike Sharing open data. The existing bike sharing app that we obtained this data from contains the locations of each hub and the number of bicycles and docks available, but does not show suggested routes for users or members to take from hub to hub.

We have improved on this by creating a Toronto Bikeways network dataset by taking Toronto open transportation data and removing any roads or pathways that bikes are not permitted on, with priority routes based on designated bicycle infrastructure and recommended street routes. This was uploaded to an ESRI ArcGIS Server as a Network Analysis service, allowing us to generate routes through this Bikeways network. This allows us to find the closest origin hub to a user’s location and generate routes to any destination hub that only use bike-friendly routes, avoiding dangerous roads and optimizing their cycling experience. The cycling distance between the hubs is also calculated using the Measure tool and pops up on-screen.

Data Sources:
-------------
* [Toronto Bike Share Hub Data](https://feeds.bikesharetoronto.com/stations/stations.xml)
* [Toronto Road Network](http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=9ecd5f9cd70bb210VgnVCM1000003dd60f89RCRD&vgnextchannel=1a66e03bb8d1e310VgnVCM10000071d60f89RCRD)
* [Toronto Ward Shapefile](http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=71d9c7e6e34b6410VgnVCM10000071d60f89RCRD)
* [Canadian Water Bodies Shapefile](http://geogratis.gc.ca/api/en/nrcan-rncan/ess-sst/87066e9a-94ee-680a-b1ba-591f4688db7d.html)

Limits and Assumptions:
-----------------------
* Assumes that the bicycle count at a bike hub is always greater than zero due to working with static data, which leads to a limitation that the app is unable to report the correct number of bicycles at a bike hub. Solution: use dynamic data provided by Toronto rather than static.
* The app currently operates in the Downtown Toronto / East York area due to the limited availability of Bike Share Toronto bike hubs placed throughout the city. Solution: the application will update once more bike hubs are installed and recorded.

Improvements:
-------------
By computing route with additional variables to base route preference (ie. slope gradient, traffic volumes, traffic lights, and turn frequencies) the app could more accurately display the optimal route.

**Disclaimer**: *Social Bikes is not affiliated with any of the organisations or programs present in the app. The app was made strictly for educational purposes in conjunction with the 2017 ECCE App Challenge. This app is a prototype and all calculations are purely estimates. The app was tested on and works with Chrome and Firefox web browsers.*
