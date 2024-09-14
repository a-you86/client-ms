import {Component, inject, signal, ViewChild} from '@angular/core';
import {GatewayService} from './gateway.service';
import {JsonPipe} from '@angular/common';
import {MapComponent} from '../../demo/map/map.component';

@Component({
  selector: 'app-gateway',
  standalone: true,
  imports: [
    JsonPipe,
    MapComponent
  ],
  templateUrl: './gateway.component.html',
  styleUrl: './gateway.component.scss'
})
export class GatewayComponent {

  @ViewChild(MapComponent) mapComponent!: MapComponent;



  private gatewayService = inject(GatewayService);
  // // routes = this.gatewayService.routes;
  // messages = signal<string[]>([], {type: 'array'});
  //
  // constructor() {
  //   this.gatewayService.connect('ws://localhost:8030/ws').subscribe(
  //     (message) => {
  //       this.messages.push(message);
  //
  //       // Parse the message and extract coordinates
  //       const carData = JSON.parse(message);
  //
  //       const latitude = carData.latitude;
  //       const longitude = carData.longitude;
  //
  //       // Update the car position on the map
  //       this.mapComponent.updateCarPosition(latitude, longitude);
  //     },
  //     (error) => {
  //       console.error('WebSocket error:', error);
  //     },
  //     () => {
  //       console.log('WebSocket connection closed');
  //     }
  //   );
  // }
}
