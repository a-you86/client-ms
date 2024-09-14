import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {toSignal} from '@angular/core/rxjs-interop';
import { RxStomp } from '@stomp/rx-stomp';
import {map, Observable, Observer, Subject, Subscription} from 'rxjs';
import SockJS from 'sockjs-client';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  private socket!: WebSocket;
  private subject!: Subject<any>;
  private carPositionSubject = new Subject<{latitude: number, longitude: number}>();


  private http: HttpClient = inject(HttpClient);
  private location = inject(Location);

  // routes = toSignal<GwVM[]>(this.http.get('http://localhost:8080/api/gateway/routes') as any);


  constructor() {
    this.subject = new Subject<any>();
  }

  get carPosition$(): Observable<{latitude: number, longitude: number}> {
    return this.carPositionSubject.asObservable();
  }

  public connect(url: string): Observable<any> {
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

export type GwVM = {path: string, serviceId: string, serviceInstances: string};
