import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapProvider {
  private socket!: WebSocket;
  private subject!: Subject<any>;
  constructor() {
    this.subject = new Subject<any>();
  }
  connect(url: string): Observable<any> {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      this.subject.next(event.data);
    };

    this.socket.onerror = (event) => {
      this.subject.error(event);
    };

    this.socket.onclose = (event) => {
      this.subject.complete();
    };

    return this.subject.asObservable();
  }

  public sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }

}
