// load choosen locations in the neighbourhood.
var choosenLocations = [
  {
    place: "Pharmacie Bastos",
    lats: 3.892178,
    longs: 11.512062
  },
  {
    place: "Tchop et Yamo",
    lats: 3.887423,
    longs: 11.502639
  },
  {
    place: "Alfresco Pizza",
    lats: 3.892596,
    longs: 11.518395
  },
  {
    place: "JC Bar",
    lats: 3.892883,
    longs: 11.510174
  },
  {
    place: "Platinium Cafe",
    lats: 3.893226,
    longs: 11.509138
  },
  {
    place: "Afriland Firstbank",
    lats: 3.87505,
    longs: 11.516231
  }
];

// Initializing map properties
var content;
var map;
var infoWindow;

//Forsquare Ids
var CLIENT_ID = "Q5MK2XFDK3FVTDQLOQKSFTKS1CI1XEWZSO2TIPP5DU2PWICK";
var CLIENT_SECRET = "MQ3CZLR5KY1F04FUAX5YWXOLYRRJSYFWCHZANZZ23M4WI05L";

// function to start the app
function startApplication() {
  ko.applyBindings(ViewModel());
}

//Bind the model to the view
function myLocation(data) {
  var self = this;
  this.place = data.place;
  this.lats = data.lats;
  this.longs = data.longs;
  this.street = "";
  this.city = "";

  this.visible = ko.observable(true);

  // Foursquare API implementation
  var foursquareURL =
    "https://api.foursquare.com/v2/venues/search?ll=" +
    data.lats +
    "," +
    data.longs +
    "&client_id=" +
    CLIENT_ID +
    "&client_secret=" +
    CLIENT_SECRET +
    "&v=20170710" +
    "&query=" +
    data.place;

  // get the information from foursquare
  $.getJSON(foursquareURL)
    .done(function(apiData) {
      // parse json from foursquare
      var results = apiData.response.venues[0];
      self.street = results.location.formattedAddress[0];
      if (results.location.formattedAddress[1] === undefined) {
        city = "";
      } else {
        self.city = results.location.formattedAddress[1];
      }

      contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        "</div>" +
        '<h1 id="firstHeading" class="firstHeading">' +
        data.place +
        "</h1>" +
        '<div id="bodyContent">' +
        self.street +
        " " +
        self.city +
        "<p><small>Provided by FOURSQUARE API Service.</small></p>" +
        "</div>" +
        "</div>";
    })
    .fail(function() {
      alert("An error occured in the Foursquare API call.");
    });
  this.infoWindow = new google.maps.InfoWindow({
    content: self.contentString
  });

  this.marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.lats, data.longs),
    map: map,
    animation: google.maps.Animation.DROP,
    title: data.place,
    icon:
      "http://www.googlemapsmarkers.com/v1/" +
      data.place.match(/\b(\w)/g).join("").toUpperCase() +
      "/FFFF00" //Googlemapsmarkers API with label from (http://www.googlemapsmarkers.com/)
  });

  this.showMarker = ko.computed(function() {
    if (this.visible() === true) {
      this.marker.setMap(map);
    } else {
      this.marker.setMap(null);
    }
    return true;
  }, this);

  this.marker.addListener("click", function() {
    self.contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h1 id="firstHeading" class="firstHeading">' +
      data.place +
      "</h1>" +
      '<div id="bodyContent">' +
      self.street +
      " " +
      self.city +
      "<p><small>Provided by FOURSQUARE API Service.</small></p>" +
      "</div>" +
      "</div>";

    var latlng = new google.maps.LatLng(data.lats, data.longs);
    map.setZoom(18); //Set the zoom on the map to view the marker
    map.panTo(latlng); // Pan the map to correct marker when list view item is clicked

    self.infoWindow.setContent(self.contentString);

    self.infoWindow.open(map, this);

    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      self.marker.setAnimation(null);
    }, 2100);
  });

  this.bounce = function(place) {
    google.maps.event.trigger(self.marker, "click");
  };
}

function ViewModel() {
  var self = this;
  this.query = ko.observable("");
  this.locationList = ko.observableArray([]);

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
    styles: [
      {
        elementType: "geometry",
        stylers: [
          {
            color: "#242f3e"
          }
        ]
      },
      {
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#242f3e"
          }
        ]
      },
      {
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#746855"
          }
        ]
      },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#d59563"
          }
        ]
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#d59563"
          }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
          {
            color: "#263c3f"
          }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#6b9a76"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#38414e"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#212a37"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9ca5b3"
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          {
            color: "#746855"
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#1f2835"
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#f3d19c"
          }
        ]
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [
          {
            color: "#2f3948"
          }
        ]
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#d59563"
          }
        ]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#17263c"
          }
        ]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#515c6d"
          }
        ]
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#17263c"
          }
        ]
      }
    ]
    // End Of Styling
  };
  // Constructor creates a new map - with defined map styling.
  map = new google.maps.Map(document.getElementById("map"), mapProp);

  choosenLocations.forEach(function(locationItem) {
    self.locationList.push(new myLocation(locationItem));
  });

  //Search algorithm
  this.search = ko.computed(function() {
    var filter = self.query().toLowerCase();
    if (!filter) {
      self.locationList().forEach(function(locationItem) {
        locationItem.visible(true);
      });
      return self.locationList();
    } else {
      return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
        var string = locationItem.place.toLowerCase();
        var result = string.search(filter) >= 0;
        locationItem.visible(result);
        return result;
      });
    }
  }, self);
}

function mapError() {
  alert("Google maps had a problem during loading reload it.");
}
