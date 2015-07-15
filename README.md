# Angular-GeoKey

Angular-GeoKey is an example of a simple front-end application for the back-end platform [GeoKey](http://geokey.org.uk/). 

## Features

* Drag and Drop KML / GPX files onto map for easy insertion into GeoKey and fast map previewing
* Saves GeoJSON data in local storage for fewer calls to GeoKey and increase speed.
* Save, Edit and Delete features and feature properties
* Register new users
* Restrict edit and data creation to signed in users
* Uses HTML Interceptor to handle OAuth 2 tokens

## Live Demo

[Angular-GeoKey](http://178.62.58.84/Angular-GeoKey/)

## Installation

Angular-GeoKey has a number of dependencies.  The easiest way to get started with this application is to pull or download this repository and run bower install 

```
bower Install 
```
Next, update the geokeyData.js file with your specific GeoKey client information as well as the project ID and category ID
```
    function geokeyData() {

        var params = {
            client_id: 'xxxxxxxxxxxxxxx',
            client_secret: xxxxxxxxxxxxxxxxxxxx,
            grant_type: 'password'
        };
        var url = 'http://xxxxxxxxxxxx/';
        var projectId = x;
        var categoryId = x
```
For all information regarding GeoKey, refer to the GeoKey [API documents](http://geokey.org.uk/docs/web-api.html) and [Github page](https://github.com/ExCiteS/geokey)
