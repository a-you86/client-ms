import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {ICarData, Iposition} from './map/VehicleSensorData';  // Assuming this contains carId, latitude, longitude, etc.
import { MapProvider } from './map.provider';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private mapProvider = inject(MapProvider);

  // Subject to emit WebSocket updates
  private carPositionSubject = new Subject<{ carId: string; latitude: number; longitude: number }>();

  // Observable that components can subscribe to
  carPositionUpdates$ = this.carPositionSubject.asObservable();

  // BehaviorSubject to hold the current vehicles array
  private vehiclesSubject = new BehaviorSubject<Array<{ carId: string; latitude: number; longitude: number }>>([]);

  // Observable for components to subscribe to for vehicles array
  vehicles$ = this.vehiclesSubject.asObservable();


  connect() {
    this.mapProvider.connect('ws://localhost:8030/ws').subscribe(
      (message: any) => {
        const parsedMessage: ICarData = typeof message === 'string' ? JSON.parse(message) : message;
       console.error('WebSocket error:',parsedMessage),
        parsedMessage.positions.forEach((position: Iposition) => {
          const { carId, latitude, longitude } = position;
          this.carPositionSubject.next({ carId, latitude, longitude });
          this.updateVehiclePosition(carId, latitude, longitude);
        })
        console.log('Received message:', parsedMessage);

        console.log('Received message:', parsedMessage);

        // Emit the new position via the Subject


        // Update the vehicles array with the new position

      },
      error => console.error('WebSocket error:', error),
      () => console.log('WebSocket connection closed')
    );
  }

  // Method to dynamically update or add the vehicle position to the vehicles array
  private updateVehiclePosition(carId: string, latitude: number, longitude: number) {
    const vehicles = this.vehiclesSubject.value;
    const vehicleIndex = vehicles.findIndex(vehicle => vehicle.carId === carId);

    if (vehicleIndex !== -1) {
      // Update the existing vehicle's position
      vehicles[vehicleIndex] = { carId, latitude, longitude };
    } else {
      // Add the new vehicle if it doesn't exist
      vehicles.push({ carId, latitude, longitude });
    }

    // Emit the updated vehicles array
    this.vehiclesSubject.next([...vehicles]);
  }
}
