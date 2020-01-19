const CORS_ANY_WHERE_PROXY_API_SERVICE = "https://cors-anywhere.herokuapp.com",
  FIND_ALL_BUS_LOCATION_API = "http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus",
  FIND_BUS_BY_ROUTE = "http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetBusByRoute";

export const BusMapLib = {
    getLocationsDTO: async function() {
      try {
        const locations = await this.getBusLocations();
        const allLocations = locations.map((location) => {
          return {
            route: location.ROUTE,
            lat: location.LATITUDE,
            long: location.LONGITUDE,
            timepoint: location.TIMEPOINT
          };
        }), locationsDTO = {
          Locations: allLocations
        };
        return locationsDTO;      
      } catch {
        return [];
      }
    },

    getBusLocations: async function(route) {
      try {
        const BUS_ROUTE_INFO_API = (route === undefined) ? 
          FIND_ALL_BUS_LOCATION_API :
          `${FIND_BUS_BY_ROUTE}/${route}`,
          CORS_COMPOSED_API = `${CORS_ANY_WHERE_PROXY_API_SERVICE}/${BUS_ROUTE_INFO_API}`;
        const res = await fetch(CORS_COMPOSED_API);
        return await res.json();
      } catch {
        return [];
      }
    }
}

export default BusMapLib;