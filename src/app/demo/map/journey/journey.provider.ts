import {inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JourneyProvider {

  private httpClient = inject(HttpClient);

  sendJourney(journey: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:8087/api/journey', journey)
  }

}
