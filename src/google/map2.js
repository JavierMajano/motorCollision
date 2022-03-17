
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
let poly;
let coordarr = [];
let url2;


const options = [
  { value: 'Bronx', label: 'BRONX' },
  { value: 'Brooklyn', label: 'BROOKLYN' },
  { value: 'Queens', label: 'QUEENS' },
  { value: 'Manhattan', label: 'MANHATTAN' },
  { value: 'Staten Island', label: 'STATEN ISLANDp' },
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
     //this.setState({radius: selectedOption.value})
        this.setState({ selectedOption, }, () =>
          console.log(`Option selected:`, this.state.selectedOption.label)

        );
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
     
      
 
    geocoder = new window.google.maps.Geocoder();
      infowindow = new window.google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: this.state.location,
    });
    infowindow.open(map);
    map.addListener("click", (mapsMouseEvent)=>{ // this evenlistenr is used for creating a circle radius after a click is made
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

    }
    if (marker && marker.setMap) {
      marker.setMap(null);
  }
     marker = new window.google.maps.Marker({ // this marker is for cicle radius to move around
      position: location,
      map: map,
      draggable: true,
    });
    

     circle = new window.google.maps.Circle({  // creating circle from click event
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      radius : this.state.radius,
      center: location
    })

    circle.bindTo('center', marker, 'position'); // makes the marker binded to circle
  // geocodeLatLng(geocoder, map, infowindow,);

    })
// function geocodeLatLng(geocoder, map, infowindow){
//   const latlng = infowindow.position.toJSON();
//   console.log(latlng);
//   geocoder
//     .geocode({ location: latlng })
//     .then((response) => {
//       console.log(response)
//       if (response.results[0]) {
//         map.setZoom(11);

//         const marker = new window.google.maps.Marker({
//           position: latlng,
//           map: map,
//         });

//         infowindow.setContent(response.results[0].formatted_address);
        
//         infowindow.open(map, marker);
//       } else {
//         window.alert("No results found");
//       }
//     })
//     .catch((e) => window.alert("Geocoder failed due to: " + e));
// }
  
    }
    currentBorough = (event) =>{  // handles buttom click and this is used for getting the selected borough & creating the boundary
      
      let url;
      console.log(coordarr)
      coordarr = [];
  
      if(poly !== undefined) // looks at poly and see if its filled with stuff
      {
        console.log(poly)
    
         poly.setMap(null);
     
         poly = null
    
        console.log(poly)
      
      }
    if((this.state.selectedOption === null))
    {
       url = `https://data.cityofnewyork.us/resource/h9gi-nx95.json`;
  
    }
    else{
       url = `https://data.cityofnewyork.us/resource/h9gi-nx95.json?borough=${this.state.selectedOption.label}`;  
       url2 = `https://data.cityofnewyork.us/resource/7t3b-ywvw.json?boro_name=${this.state.selectedOption.value}`;  
    }
    
    console.log(typeof(this.state.selectedOption))
    let options = {
      method: 'GET',
           headers: {'X-App-Token': 'xpFnBGBIZmWJ2mf0v43C7muyB'}
    };
    
    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        this.setState({borough: json})
        //console.log(this.state.borough)
      })
      .catch(err => console.error('error:' + err));
      console.log(this.state.selectedOption.value)

   
  
      let options2 = {method: 'GET'};
    
      fetch(url2, options2)
        .then(res => res.json())
        .then(json => {
           // console.log(json[0].the_geom.coordinates)
            let coordinates = json[0].the_geom.coordinates
            console.log(coordinates)
            for(let i = 0; i < coordinates.length; i++){
             
              for ( let j=0; j<coordinates[i].length; j++ ){
                console.log(coordinates[i][j])
                //console.log(coordinates[i][j])
                coordarr = coordinates[i][j].map( coord => ({ lat: coord[1], lng: coord[0] }) );  
           
              }     
            }
            // outside of for loop
            poly = new window.google.maps.Polygon({
              paths: coordarr,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillOpacity: 0.35,
          });
            console.log(poly)
          poly.setMap(map);
           console.log(coordarr)
           
      
       
          }
        )
      
        .catch(err => console.error('error:' + err));
     
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
           <button className="btn btn-primary" onClick={this.currentBorough}>Enter city</button>
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