
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from "socket.io-client";
import { User } from 'src/app/models/user';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: any;
  readonly uri: string = environment.serverSocket;
  user: User;

  constructor(
    private auth: AuthService
  ) {
    this.user = this.auth.userData();
  }

  connect(){
    this.socket = io(this.uri, {
      query: {
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        user_id: this.user.user_id.toString()
      }
    });
  }

  listen(eventName: string) {
    return new Observable(subscriber => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      })
    })
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  close() {
    console.log('desconectando websocket');
    this.socket.disconnect();
  }

}