import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import BusMapLib from './bus-map-lib';

const GOOGLE_API_KEY = "AIzaSyBiiJ08QnqoiiFhSHIZw5LFI9Ph8x-r0_g";
const ATLANTA_CENTER_GEO_LOCATION = {lat: 33.7612762, lng: -84.3719627};

class BusMap extends Component {
  static defaultProps = {
    center: ATLANTA_CENTER_GEO_LOCATION,
    zoom: 12,
    BusInfo : {}
  };

  constructor(props)
  {
    super(props);
    this.state = { ...this.props };
    this.googleMap = {};
    this.renderAllBusInProvidedRoute = 
      this.renderAllBusInProvidedRoute.bind(this);
  }

  componentDidMount() {
    // For Output 1
    BusMapLib.getLocationsDTO().then((locationsDTO) => {
      console.log("locationsDTO", locationsDTO);
      console.log("locationsDTOJSON", JSON.stringify(locationsDTO));
      console.log("Array DTO", JSON.stringify(locationsDTO.Locations));
    });
  }

  // For Output 2
  clearGoogleMap(maps) {
    (maps.markers !== undefined) && maps.markers.map((marker) => {
      marker.setMap(null);
      return marker;  
    });
    (maps.busRootPath !== undefined) && maps.busRootPath.setMap(null);
    maps.markers = [];
    maps.busRootPath = undefined;
  }

  //  This method used to render all bus in provided route
  //  Note: this will render all bus in atlanta, if the route is undefined
  renderAllBusInProvidedRoute({ map, maps, route }) {
    this.clearGoogleMap(maps);
    this.setState({map, maps, route});
    maps.renderAllBusInProvidedRoute = this.renderAllBusInProvidedRoute;
    BusMapLib.getBusLocations(route).then((data) => {
      this.setState({BusInfo: {Locations: data},
        maps, route}, 
        () => {this.drawMarkerAndInfo(this.state)});
    });
  }

  drawMarkerAndInfo({maps, map, route}) {
    const { BusInfo } = this.state,
    { Locations } = BusInfo;
    if (Locations === null) {
      return;
    }
    const busRootCoordinates = Locations.map((location, index) => {
      const marker = this.createMarkerAndInfoWindow(this.state, 
        {location, index}
      );
      maps.markers.push(marker);
      return marker.position;
    });

    const busRootPath = new maps.Polyline({
      path: busRootCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.5,
      strokeWeight: 2
    });

    maps.busRootPath = busRootPath;

    (route !== undefined) && busRootPath.setMap(map);
  }

  createMarkerAndInfoWindow({map, maps, route}, {location, index}) {
    const navigationTitle = route === undefined ? 
      `Click to find bus location for this route(${location.ROUTE})` : 
      "Bus Information",
      busInfoWidget = new maps.InfoWindow({
        content: `<div>
          <font color="gray">
            <h3>${navigationTitle}</h3>
            <table border="0" key="${index}">
              <col width="120">
              <tr><th align="left" width = "50">TIMEPOINT</th><td align = "left">${location.TIMEPOINT}</td></tr>
              <tr><th align="left">TRIPID</th><td align = "left">${location.TRIPID}</td></tr>
              <tr><th align="left">VEHICLE</th><td align = "left">${location.VEHICLE}</td></tr>
              <tr><th align="left">ROUTE</th><td align = "left">${location.ROUTE}</td></tr>
              <tr><th align="left">MSGTIME</th><td align = "left">${location.MSGTIME}</td></tr>
              <tr><th align="left">DIRECTION</th><td align = "left">${location.DIRECTION}</td></tr>
              <tr><th align="left">BLOCKID</th><td align = "left">${location.BLOCKID}</td></tr>
              <tr><th align="left">ADHERENCE</th><td align = "left">${location.ADHERENCE}</td></tr>
            </table>
          </font>
        </div>`
    }),
      marker = new maps.Marker({
        position: {lat:parseFloat(location.LATITUDE), lng: parseFloat(location.LONGITUDE)},
        map,
        animation: maps.Animation.DROP,
        title: location.TIMEPOINT
      });

    marker.addListener('mouseover', function() {
        marker.setAnimation(maps.Animation.BOUNCE);
        busInfoWidget.open(map, marker);
    });

    marker.addListener('mouseout', function() {
        marker.setAnimation(null);
        (route === undefined) && busInfoWidget.close(map, marker);
    });            

    marker.addListener('click', function() {
        const busRouteSelected = {
          map,
          maps,
          route: location.ROUTE
        };
        (route === undefined) && maps.renderAllBusInProvidedRoute(busRouteSelected);
    });

    (route !== undefined) && busInfoWidget.open(map, marker);

    return marker;
  }

  render() {
    const {
      center, 
      zoom
    } = this.props;
    return (
        <div style={{ height: '100vh', width: '100%' }}>
          <button onClick={() => this.renderAllBusInProvidedRoute({...this.state, route: undefined})}>
            Show All Bus Location
          </button>
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
            defaultCenter={center}
            defaultZoom={zoom}
            yesIWantToUseGoogleMapApiInternals={true}
            onGoogleApiLoaded={({map, maps}) => this.renderAllBusInProvidedRoute({map, maps})}
          />
        </div>
    );
  }
}

export default BusMap;