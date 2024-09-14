import {Component, inject} from '@angular/core';
import {TranslateDirective} from '../shared/langauge/translate.directive';
import {GatewayComponent} from '../admin/gateway/gateway.component';
import {MapComponent} from '../demo/map/map.component';
import {JourneyComponent} from '../demo/map/journey/journey.component';
import {CommandModule} from '@angular/cli/src/command-builder/command-module';
import {CommonModule} from '@angular/common';
import {JourneyService} from '../demo/map/journey/journey.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TranslateDirective,
    GatewayComponent,
    MapComponent,
    JourneyComponent,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  startLocation: [number, number] = [0, 0];
  endLocation: [number, number] = [0, 0];
  carId: string = '';

  handleJourneyCoordinates(event: { startLocation: [number, number], endLocation: [number, number], carId: string }): void {
    this.startLocation = event.startLocation;
    this.endLocation = event.endLocation;
    this.carId = event.carId;  // Capture the carId here
  }
}
