import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {toSignal} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private nominatimUrl = 'https://nominatim.openstreetmap.org/search';
  private http = inject(HttpClient);

  gecodeAddress(address: string) {
    return this.http.get(this.nominatimUrl, {
      params: {
        q: address,
        format: 'json',
        limit: '1',
        addressdetails: '1'
      }
    });
  }
}
