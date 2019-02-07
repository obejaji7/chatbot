import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/';
import { map } from 'rxjs/operators';
import { WebsocketService } from '../websocket/websocket.service';
import { Message } from '../../interfaces/IMessage';
import { Command } from '../../interfaces/Command';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public messages: Subject<any>;

  constructor(
    private webscoketService: WebsocketService,
    private httpClient: HttpClient
  ) {
    this.messages = <Subject<any>>(
      this.webscoketService.connect(environment.websoccketUrl).pipe(
        map(
          (response: MessageEvent): any => {
            return JSON.parse(response.data);
          }
        )
      )
    );
  }

  endChat() {
    this.webscoketService.close();
  }

  sendMessage(message: Message) {
    this.httpClient.post(`${environment.apiUrl}/messages`, message).toPromise();
  }

  sendCommand(command: Command) {
    this.httpClient.post(`${environment.apiUrl}/bot`, command).toPromise();
  }

  getMessages(): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${environment.apiUrl}/messages`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(messages =>
        messages.map(message => {
          const m = new Message();
          m.Id = message.Id || message['id'];
          m.Color = message.Color || message['color'];
          m.Content = message.Content || message['content'];
          m.Username = message.Username || message['username'];
          return m;
        })
      )
    );
  }

  isJson(item) {
    item = typeof item !== 'string' ? JSON.stringify(item) : item;

    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }

    if (typeof item === 'object' && item !== null) {
      return true;
    }

    return false;
  }
}
