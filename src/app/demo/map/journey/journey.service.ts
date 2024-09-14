import {Observable, zip} from 'rxjs';
import { map } from 'rxjs/operators';
import {inject, Injectable, WritableSignal, signal, computed, effect} from '@angular/core';
import { GeocodingService } from '../geocoding.service';
import {JourneyProvider} from './journey.provider';
import {toSignal} from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class JourneyService {
  startLocationSignal = signal<[number, number]>([0, 0]);
  endLocationSignal = signal<[number, number]>([0, 0]);
  private journeyProvider = inject(JourneyProvider);
  private GeocodingService = inject(GeocodingService);

  sendJourney(journey: any) {
    this.journeyProvider.sendJourney(journey).subscribe({
      next: (result: any) => {
        console.log(result);
      }
    });

  }







  // Updated to return an observable
  public lookupCoordinates(location: string): Observable<string> {
    return this.GeocodingService.gecodeAddress(location).pipe(
      map((result: any) => {
        if (result.length > 0) {
          return result;
        }
        return [];
    }));
  }
}
