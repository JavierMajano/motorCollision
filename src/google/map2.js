
import React, { Component } from 'react';
import Map from '../components/map/map';
import Select from 'react-select';
const API_KEY = 'AIzaSyDz2R7uwwfoFu4KH6qgSofChVgONHPuplE';


var map;
let infowindow;
var service;
let geocoder;
let circle;
let marker;

const options = [
  { value:500 , label:500  },
  { value: 1000, label: 1000 },
  { value: 1500, label: 1500 }
]
class App extends Component {

    state = {
 
        lat: 40.75814,
        lng: -73.98626,
        selectedOption : 500,
        radius : 500,
  
      zoom: 15
    }
   handleChange = (selectedOption) => {
     console.log(selectedOption.value)
     this.setState({radius: selectedOption.value})
        // this.setState({ selectedOption, }, () =>
        //   console.log(`Option selected:`, this.state.selectedOption.label)

    //    );
      };
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
       marker = new window.google.maps.Marker({
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
     
      console.log(mapsMouseEvent.latLng.toJSON().lat)
      this.setState({lat : mapsMouseEvent.latLng.toJSON().lat, lng : mapsMouseEvent.latLng.toJSON().lng})

      location= {lat: this.state.lat, lng: this.state.lng}
      // Create a new InfoWindow.
      infowindow = new window.google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
      
    });
    infowindow.setContent(
      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    );
    infowindow.open(map);
    console.log(circle)
    
    if(circle !== undefined)
    {
      circle.setMap(null)
      // marker.setMap(null);
    }
    if (marker && marker.setMap) {
      marker.setMap(null);
  }
     marker = new window.google.maps.Marker({
      position: location,
      map: map,
      draggable: true,
    });
    

     circle = new window.google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      radius : this.state.radius,
      center: location
    })

    circle.bindTo('center', marker, 'position');
  // geocodeLatLng(geocoder, map, infowindow,);

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
      const { selectedOption } = this.state;
      return (
        <div className="App">
          
           <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
          />
           <button className="btn btn-primary" onClick={this.currentBorough}>Enter Radius</button>
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