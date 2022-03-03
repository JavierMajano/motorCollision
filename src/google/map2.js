
import React, { Component } from 'react';
import Map from '../components/map/map';
const API_KEY = 'AIzaSyDz2R7uwwfoFu4KH6qgSofChVgONHPuplE';

var map;
let infowindow;
var service;
let geocoder;

class App extends Component {

    state = {
 
        lat: 40.75814,
        lng: -73.98626,
  
      zoom: 15
    }
  
    componentDidMount() {
      this.renderMap();
    }
  
    renderMap = () => {
      loadScript(`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`);
      window.initMap = this.initMap;
    }
  
    initMap = () => {
  
      // Default Location
      var location = {
        lat: this.state.lat,
        lng: this.state.lng
        };
        console.log(location);
  
    //  Initialize Map
      map = new window.google.maps.Map(document.getElementById('map'), {
          center: location,
          zoom: 15,
          // styles: mapStyle
      });
  
      // Current Location Marker
      var marker = new window.google.maps.Marker({
          position: location,
          map: map,
          title: "You're Here!"
      });
  
    //   // Ask for user location
    //   this.getCurrentLocation();
      
    geocoder = new window.google.maps.Geocoder();
      infowindow = new window.google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: this.state.location,
    });
    infowindow.open(map);
    map.addListener("click", (mapsMouseEvent)=>{
      // Close the current InfoWindow.
      infowindow.close();
      console.log(mapsMouseEvent.latLng.toJSON())
      // Create a new InfoWindow.
      infowindow = new window.google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
      
    });
    infowindow.setContent(
      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    );
    infowindow.open(map);
   geocodeLatLng(geocoder, map, infowindow,);

    })
function geocodeLatLng(geocoder, map, infowindow){
  const latlng = infowindow.position.toJSON();
  console.log(latlng);
  geocoder
    .geocode({ location: latlng })
    .then((response) => {
      console.log(response)
      if (response.results[0]) {
        map.setZoom(11);

        const marker = new window.google.maps.Marker({
          position: latlng,
          map: map,
        });

        infowindow.setContent(response.results[0].formatted_address);
        
        infowindow.open(map, marker);
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}
  
    }
  
    render() {
      return (
        <div className="App">
          <Map />
        </div>
      );
    }
  }
  
  function loadScript(url) {
    let index  = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;
    index.parentNode.insertBefore(script, index);
  }
  
  export default App;