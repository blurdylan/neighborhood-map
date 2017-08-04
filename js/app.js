//*** APIKEY = AIzaSyCacmIGcWsolGnXLp71cBM_My9axyprocM ***//

// A JSON file containing data of choosen locations in the neighbourhood.
var jsonFile = "js/location/locations.json";
var choosenLocations;
$.getJSON(jsonFile, function (json1) {
    choosenLocations = json1;
});

//Map properties
var content;
var map;
var infoWindow;

//Forsquare Ids
var CLIENT_ID = 'Q5MK2XFDK3FVTDQLOQKSFTKS1CI1XEWZSO2TIPP5DU2PWICK';
var CLIENT_SECRET = 'MQ3CZLR5KY1F04FUAX5YWXOLYRRJSYFWCHZANZZ23M4WI05L';

function initializeMap() {
    // Create map properties and set styles
    var mapProp = {
        //Define the initial view of the map
        center: {
            lat: 3.885441,
            lng: 11.514515
        },
        disableDefaultUI: true,
        zoom: 15,
        // Styling the map : credits to google (https://developers.google.com/maps/documentation/javascript/styling)
        styles: [{
                elementType: 'geometry',
                stylers: [{
                    color: '#242f3e'
                }]
            },
            {
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#242f3e'
                }]
            },
            {
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#746855'
                }]
            },
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{
                    color: '#263c3f'
                }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#6b9a76'
                }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{
                    color: '#38414e'
                }]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#212a37'
                }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#9ca5b3'
                }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{
                    color: '#746855'
                }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{
                    color: '#1f2835'
                }]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#f3d19c'
                }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{
                    color: '#2f3948'
                }]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#d59563'
                }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{
                    color: '#17263c'
                }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{
                    color: '#515c6d'
                }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{
                    color: '#17263c'
                }]
            }
        ]
        // EOStyles
    };
    // Constructor creates a new map - with defined map styling.
    map = new google.maps.Map(document.getElementById('map'), mapProp);
}

//Bind the model to the view
function myLocation(data) {
    var self = this;
    this.place = ko.observable(data.place);
    this.lats = ko.observable(data.lats);
    this.longs = ko.observable(data.longs);
    this.street = "";
    this.city = "";
}

function ViewModel() {
    var self = this;

    //Array marker initialized
    self.markers = [];

    //Copy choosenLocations to stock them in allLocations
    self.allLocations = ko.observableArray(choosenLocations);

    self.allLocations().forEach(function (location) {
        var latlng = new google.maps.LatLng(location.lats, location.longs);
        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            animation: google.maps.Animation.DROP,
            title: location.place,
            icon: 'http://www.googlemapsmarkers.com/v1/' + (((location.place).match(/\b(\w)/g)).join('')).toUpperCase() + '/FFFF00' //Googlemapsmarkers API with label from (http://www.googlemapsmarkers.com/)
        });
        location.marker = marker;

        //put the markers into the map array
        this.markers.push(marker);

        //Foursquare API implementation
        var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + location.lats + ',' + location.longs + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20170710' + '&query=' + location.place;
        
        //Parse the results recieved through foursquare
        $.getJSON(foursquareURL).done(function (apiData) {
            var results = apiData.response.venues[0];
            street = results.location.formattedAddress[0];
            if (results.location.formattedAddress[1] === undefined) {
                city = "";
            } else {
                city = results.location.formattedAddress[1];
            }

            /* content = "<h1>" + place + "</h1>" + "<h4>" + street + " " + city + "</h4>" + "<img class= sqlogo src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Foursquare_logo.svg/1280px-Foursquare_logo.svg.png' alt = foresquarelogo>"; */

            contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+ location.place +'</h1>'+
            '<div id="bodyContent">'+ street + " " + city + "<p><small>Provided by FOURSQUARE API Service.</small></p>" +"</div>" + "</div>";

            bindInfoWindow(location.marker, map, infowindow, contentString);

        }).fail(function () {
            alert("Foursquare API error. Please refresh the page and try again to load Foursquare data.");
        });

    });


    //Map proprieties to each item in the markers array
    self.markers.map(function (info) {
        infoWindow = new google.maps.InfoWindow({});
        info.addListener('click', function () {
            //infoWindow.open(map, this),
            info.setAnimation(google.maps.Animation.BOUNCE); //Markers will bounce when clicked
            setTimeout(function () {
                info.setAnimation(null);
            }, 2200); //Stop markers animation 2s after click
        });

    });

    //item click from list view
    self.listViewClick = function (place) {
        if (place.place) {
            var latlng = new google.maps.LatLng(place.lats, place.longs);
            map.setZoom(18); //Set the zoom on the map to view the marker
            map.panTo(latlng); // Pan the map to correct marker when list view item is clicked
            place.marker.setAnimation(google.maps.Animation.BOUNCE); // Bounce animation
        }
        setTimeout(function () {
            place.marker.setAnimation(null); // End animation on marker after 2 seconds
        }, 2000);
    };

    var infowindow = new google.maps.InfoWindow();
    /**
     * Function to help bind the info window to the
     * corresponding marker
     * 
     * @param {any} marker 
     * @param {any} map 
     * @param {any} infowindow 
     * @param {any} content 
     */
        function bindInfoWindow(marker, map, infowindow, content) {
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(content);
                infowindow.open(map, marker);
            });
        }

    // Help store input during search
    self.query = ko.observable('');

    //Filter through observableArray for search to take place
    self.search = ko.computed(function () {
        return ko.utils.arrayFilter(self.allLocations(), function (listResult) {
            return listResult.place.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
        });
    });
}

//Launch app once document is ready
$(document).ready(function () {
    initializeMap();
    ko.applyBindings(ViewModel());
});