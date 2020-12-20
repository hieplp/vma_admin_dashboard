/* eslint-disable no-undef */
import { MapElementFactory } from "vue2-google-maps";
export default MapElementFactory({
  name: "directionsRenderer",

  ctr() {
    return google.maps.DirectionsRenderer;
  },

  events: [],

  mappedProps: {},

  props: {
    origin: { type: Object },
    destination: { type: Object },
    travelMode: { type: String },
    waypoints: { type: Array },
  },

  methods: {
    draw(directionsService, directionsRenderer) {
      if (!this.origin || !this.destination || !this.travelMode) return;
      // var bounds = new google.maps.LatLngBounds();
      // bounds.extend();
      // console.log(
      //   "🚀 ~ file: DirectionsRenderer.js ~ line 28 ~ draw ~ this.origin",
      //   this.origin
      // );

      directionsService.route(
        {
          origin: this.origin,
          destination: this.destination,
          waypoints: this.waypoints,
          travelMode: this.travelMode,
          optimizeWaypoints: true,
        },
        (response, status) => {
          if (status !== "OK") return;
          let routes = response.routes[0].legs;
          let resRoutes = [];
          routes.forEach((route) => {
            resRoutes.push({
              distance: route.distance,
              duration: route.duration,
            });
          });
          this.$parent.$parent.routes = resRoutes;
          directionsRenderer.setDirections(response);
        }
      );
    },
  },

  afterCreate(directionsRenderer) {
    let directionsService = new google.maps.DirectionsService();
    this.draw(directionsService, directionsRenderer);
    this.$watch(
      () => [this.origin, this.destination, this.travelMode, this.waypoints],
      () => {
        let { origin, destination, travelMode, waypoints } = this;
        if (!origin || !destination || !travelMode) return;

        directionsService.route(
          {
            origin: origin,
            destination: destination,
            waypoints: waypoints,
            travelMode: travelMode,
            optimizeWaypoints: true,
          },
          (response, status) => {
            if (status !== "OK") return;
            let routes = response.routes[0].legs;
            let resRoutes = [];
            routes.forEach((route) => {
              resRoutes.push({
                distance: route.distance,
                duration: route.duration,
              });
            });
            this.$parent.$parent.routes = resRoutes;
            directionsRenderer.setDirections(response);
          }
        );
      }
    );
  },

  ///
});
