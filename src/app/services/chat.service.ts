import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Conversation, IChatMessage } from '../core/models/caht.model';



@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket = io(environment.url);
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  connect() {
    this.socket.connect();
  }

  createConversation(participants: string[]): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('create-conversation', participants, (conversation: any) => {
        observer.next(conversation);
        observer.complete();
      });
    });
  }

  sendMessage(conversationId: string, message: IChatMessage): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('new-message', { conversationId, ...message }, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  getMessages(): Observable<IChatMessage> {
    return new Observable((observer) => {
      this.socket.on('message', (message: IChatMessage) => {
        observer.next(message);
      });
    });
  }

  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}user/user-details`);
  }

  getChatHistory(userId: string): Observable<IChatMessage[]> {
    return this.http.get<IChatMessage[]>(`${this.baseUrl}chat/history/${userId}`);
  }
}