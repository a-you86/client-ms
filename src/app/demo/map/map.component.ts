import { Component, OnInit, inject, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../map.service';
import 'leaflet-routing-machine';
import {AsyncPipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe
  ]
})
export class MapComponent implements OnInit, OnChanges {
  private map!: L.Map;
  mapService = inject(MapService);
  private markerDictionary: { [key: string]: L.Marker } = {};
  private routePolylineDictionary: { [key: string]: L.Polyline } = {}; // Store routes as polylines

  private carColorMap: { [key: string]: string } = {
    '1': 'blue',
    '2': 'red',
    '3': 'green',
    '4': 'purple',
    '5': 'orange'
  };

  @Input() startLocation: [number, number] = [0, 0];
  @Input() endLocation: [number, number] = [0, 0];
  @Input() carId: string = '';  // Add carId to track different journeys

  ngOnInit(): void {
    this.initializeMap();
    this.mapService.connect();

    // Subscribe to vehicle location updates
    this.mapService.vehicles$.subscribe(vehicles => {
      vehicles.forEach(vehicle => {
        const carId = vehicle.carId;
        const vehicleLocation: [number, number] = [vehicle.latitude, vehicle.longitude];

        // Update car marker and route when new vehicle data is received
        this.updateCarRoute(vehicleLocation, carId);
      });
    });
  }

  // React to input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startLocation'] || changes['endLocation']) {
      if (this.startLocation[0] !== 0 && this.endLocation[0] !== 0) {
        this.updateRouteOnMap(this.startLocation, this.endLocation, this.carId);
        // Zoom to the start location
        this.map.setView(this.startLocation, 10);
      }
    }
  }

  // Initialize the map
  private initializeMap(): void {
    const defaultLatLng: [number, number] = [31.2001, 29.9187]; // Default location
    this.map = L.map('mapid').setView(defaultLatLng, 18);
    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'OSM' }).addTo(this.map);
  }

  // Update the car marker and route on the map
  private updateCarRoute(location: [number, number], carId: string): void {
    // Update or add the car marker
    this.updateCarMarker(location, carId);

    const currentLatLng: [number, number] = [
      this.markerDictionary[carId].getLatLng().lat,
      this.markerDictionary[carId].getLatLng().lng
    ];
    this.updateRouteOnMap(currentLatLng, location, carId);
  }

  // Update or add car marker on the map
  private updateCarMarker(location: [number, number], carId: string): void {
    if (this.markerDictionary[carId]) {
      // If marker exists, update its position with animation (move smoothly)
      this.smoothMarkerAlongRoute(this.markerDictionary[carId], [this.markerDictionary[carId].getLatLng(), L.latLng(location[0], location[1])]);
    } else {
      // Create a new marker if it doesn't exist
      this.addCarMarker(location, carId);
    }
  }

  // Smoothly move the marker along the route
  private smoothMarkerAlongRoute(marker: L.Marker, waypoints: L.LatLng[]): void {
    const speed = 0.00005; // Adjust the speed of the marker
    let index = 0;

    const move = () => {
      if (index >= waypoints.length - 1) return; // Stop when all waypoints are covered

      const startLatLng = waypoints[index];
      const endLatLng = waypoints[index + 1];

      const distance = startLatLng.distanceTo(endLatLng); // Get the distance between points
      const duration = distance / speed;

      let progress = 0;
      const animate = (time: number) => {
        progress += time;
        const factor = Math.min(progress / duration, 1); // Progress between 0 and 1
        const lat = startLatLng.lat + factor * (endLatLng.lat - startLatLng.lat);
        const lng = startLatLng.lng + factor * (endLatLng.lng - startLatLng.lng);

        marker.setLatLng([lat, lng]);

        if (factor < 1) {
          requestAnimationFrame(animate);
        } else {
          index++;
          move(); // Move to the next waypoint
        }
      };

      requestAnimationFrame(animate);
    };

    move(); // Start moving the marker
  }

  private addCarMarker(location: [number, number], carId: string): void {
    // Use default Leaflet marker
    const marker = L.marker([location[0], location[1]]).addTo(this.map);
    marker.bindPopup(`Car ${carId}`);
    this.markerDictionary[carId] = marker;
  }

  // Update the route on the map
  private updateRouteOnMap(startLocation: [number, number], endLocation: [number, number], carId: string): void {
    console.log('Updating route:', startLocation, endLocation, carId);

    // Keep a history of the route by using Polyline
    const routeColor = this.getRouteColor(carId);

    // Get the routing waypoints and draw a polyline on the map
    const routingControl = (L as any).Routing.control({
      waypoints: [
        L.latLng(startLocation[0], startLocation[1]),
        L.latLng(endLocation[0], endLocation[1])
      ],
      lineOptions: {
        styles: [{ color: routeColor, weight: 5 }]  // Set route color and width
      },
      createMarker: () => null // Do not create default route markers
    });

    routingControl.on('routesfound', (e: any) => {
      const waypoints = e.routes[0].coordinates;

      // Draw polyline for the route
      if (this.routePolylineDictionary[carId]) {
        // If the route exists for the car, extend the polyline instead of removing it
        this.routePolylineDictionary[carId].setLatLngs(waypoints);
      } else {
        const polyline = L.polyline(waypoints, { color: routeColor }).addTo(this.map);
        this.routePolylineDictionary[carId] = polyline;
      }

      // Move the marker along the route
      this.smoothMarkerAlongRoute(this.markerDictionary[carId], waypoints);
    });

    routingControl.addTo(this.map);
  }

  private getRouteColor(carId: string): string {
    return this.carColorMap[carId] || 'blue';
  }
}
