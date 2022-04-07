import React, { Component } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import "./styles.css";
import Row from "react-bootstrap/Row";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2VhbnlhcCIsImEiOiJjbDFmZnJjaHoxMTJ6M29zOXRoajZ0czlvIn0.BJC-KwTeHSCklDlBG9SEuQ";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -70.9,
      lat: 42.35,
      zoom: 9,
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    map.once("load", () => {
      map.resize();
    });
  }

  render() {
    return (
      <Row className="mt-3 map-container">
        <div ref={this.mapContainer} />
      </Row>
    );
  }
}

export default Map;
