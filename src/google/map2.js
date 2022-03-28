
import React, { Component } from 'react';
import motorData from '../components/data/Borough.json'
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
let coordarr2 = [];
let multiCircle;
let boroug = [];
let collision = [];

const options = [
  { value: 'Bronx', label: 'BRONX' },
  { value: 'Brooklyn', label: 'BROOKLYN' },
  { value: 'Queens', label: 'QUEENS' },
  { value: 'Manhattan', label: 'MANHATTAN' },
  { value: 'Staten Island', label: 'STATEN ISLAND' },
]

function Con(props)

{


  return(
    <div>
      <ul className='list-group'>
        <li className='list-group-item' key={props.keys}>{props.hood} crashes:{props.crashes}</li>

      </ul>
    </div>
  );

}
// console.log(JSON.parse('./src/components/Borough and Neighborhood Crash Counts (2012-07-01 through 2022-03-15).geojson'))
class App extends Component {

    state = {
 
        lat: 40.75814,
        lng: -73.98626,
        selectedOption : 500,
        radius : 20,
        borough : '',
        boroug: '',
  
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
   console.log(motorData)


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
    
   
     marker = new window.google.maps.Marker({ // this marker is for cicle radius to move around
      position: location,
      map: map,
      draggable: true,
    });
    
    console.log(location)
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
      //console.log(coordarr)
      coordarr = [];
  
      if(poly !== undefined) // looks at poly and see if its filled with stuff
      {
        console.log(poly.map)
         poly = null;
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
    
    console.log(this.state.selectedOption.label)
    let options = {
      method: 'GET',
           headers: {'X-App-Token': 'xpFnBGBIZmWJ2mf0v43C7muyB'}
    };
    
    fetch(url, options)
      .then(res => res.json())
      .then(json => {
        
        for(let x = 0; x < json.length; x++)
        {
         // console.log(collision[x].location)
         
          var location = {
            lat: parseFloat(json[x].latitude),
            lng: parseFloat(json[x].longitude)
            };
           // console.log(location);
          //    console.log(coordarr2[pos])
              //  let latlng = coordarr2[pos]
               multiCircle = new window.google.maps.Circle({  // creating circle from click event
                 strokeColor: '#0000FF',
                 strokeOpacity: 0.8,
                 strokeWeight: 2,
                 fillColor: '#0000FF',
                 fillOpacity: 0.35,
                 map: map,
                 radius : this.state.radius,
                 center: location
               });
        }
      }
      )
     
      .catch(err => console.error('error:' + err));
      console.log(this.state.selectedOption.value)
      

   
  
      let options2 = {method: 'GET'};
    
      fetch(url2, options2)
        .then(res => res.json())
        .then(json => {
           // console.log(json[0].the_geom.coordinates)
            let coordinates = json[0].the_geom.coordinates
           // console.log(coordinates)
            for(let i = 0; i < coordinates.length; i++){
             
              for ( let j=0; j<coordinates[i].length; j++ ){
          //      console.log(coordinates[i][j])
              //  console.log(coordinates[i][j])
                coordarr = coordinates[i][j].map( coord => ({ lat: coord[1], lng: coord[0] }) );  
               
            //    console.log(poly)
           
            //  console.log(coordarr)
           
              }     
            }
          //   poly = new window.google.maps.Polygon({
          //     paths: coordarr,
          //     strokeColor: '#FF0000',
          //     strokeOpacity: 0.8,
          //     strokeWeight: 2,
          //     fillOpacity: 0.15,
          // });
          // poly.setMap(map);
            // outside of for loop
           
           
      
       
          }
        )
      
        .catch(err => console.error('error:' + err));
  //       if(multiCircle !== undefined)
  //   {
  //     multiCircle.setMap(null)

  //   }
  //   if (marker && marker.setMap) {
   
  //     marker.setMap(null);
  // }
  boroug = [];
          for(let j = 0; j < motorData.features.length; j++)
      {
       // console.log(motorData.features[j].properties.BoroName)
        if(motorData.features[j].properties.BoroName === this.state.selectedOption.value){
        //  console.log(motorData.features[j].properties.BoroName,[j])
        boroug.push(motorData.features[j]);
          let geom = motorData.features[j].geometry.coordinates
         // let geom2 = motorData.features
        
          
          for(let i = 0; i < geom.length; i++){
        
           coordarr2 = geom[i].map( coord =>  ({ lat: coord[1], lng: coord[0] }) ); 
            

              
            
         //    console.log(poly)
       //   console.log(coordarr2)
          
           for(const pos in coordarr2)
           {
        //    console.log(coordarr2[pos])
            //  let latlng = coordarr2[pos]
            //  multiCircle = new window.google.maps.Circle({  // creating circle from click event
            //    strokeColor: '#0000FF',
            //    strokeOpacity: 0.8,
            //    strokeWeight: 2,
            //    fillColor: '#0000FF',
            //    fillOpacity: 0.35,
            //    map: map,
            //    radius : this.state.radius,
            //    center: latlng
            //  });
            //  marker = new window.google.maps.Marker({ // this marker is for cicle radius to move around
            //   position: latlng,
            //   map: map,
  
            // });
            // multiCircle.bindTo('center', marker, 'position'); // makes the marker binded to circle
            
          
           }
        
           
         }
     
         poly = new window.google.maps.Polygon({
          paths: coordarr2,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillOpacity: 0.15,
      });
      poly.setMap(map);
        }
        else{
          console.log('fail')
        }
      }
      this.setState({boroug:boroug})
      console.log(this.state.boroug)

      for(let i = 0; i < boroug.length; i++)
      {
        let v = boroug[i].geometry.coordinates
        //console.log(v)

        for(let x = 0; x< v.length; x++)
        {
       
      //     if(boroug[i].geometry.type === 'MultiPolygon')
      //     {
      //  //     console.log(v[x])
      //      let coordarr3 = v[x].map( coord =>  ({ lat: coord[1], lng: coord[0] }) ); 
      //     // console.log(coordarr3)
      //     }
      //     else{
      //       let arr = v[x];
      //       for(let i = 0; i<arr.length; i++)
      //       {
      //   //      console.log(arr[i])
      //       }
      //     }
          
        }
        
     
     
        
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
           <button className="btn btn-primary" onClick={this.currentBorough}>Enter city</button>
          <Map />
          <div className='col-sm'> {boroug.map((content,i) => <Con crashes={content.properties.Crashes}  hood = {content.properties.NTAName} keys={content.keygit add}/> )}</div>  
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