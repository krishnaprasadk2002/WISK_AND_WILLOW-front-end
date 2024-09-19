import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IChatMessage, IConversation, IConversationwithUser } from '../core/models/caht.model';



@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket = io(environment.url);
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  connect() {
    this.socket.connect();
  }

  joinConversation(conversationId: string): Observable<any>{
    return new Observable((observer) => {
      this.socket.emit('join-conversation', { conversationId }, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }


  // Send a new message
  sendMessage(conversationId: string, message: IChatMessage): Observable<any> {
    
    return new Observable((observer) => {
      this.socket.emit('new-message', { conversationId, ...message }, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }
  sendMessageAdmin(conversationId: string, message: IChatMessage): Observable<any> {
    return new Observable((observer) => {
      this.socket.emit('admin-message', { conversationId, ...message }, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }

  // Get messages from socket
  getMessages(): Observable<IChatMessage> {
    return new Observable((observer) => {
      this.socket.on('adminMessage', (message: IChatMessage) => {
        observer.next(message);
      });
    });
  }

  getChats(): Observable<IChatMessage[]> {
    return this.http.get<IChatMessage[]>(`${this.baseUrl}chat/getchats`)
  }

  getConversationId(): Observable<IConversation > {
    return this.http.get<IConversation>(`${this.baseUrl}chat/conversation`);
  }


  getConversationData():Observable<IConversationwithUser[]>{
    return this.http.get<IConversationwithUser[]>(`${this.baseUrl}chat/getconversationdata`)
  }

  getAdminMessages():Observable<IChatMessage>{
    return new Observable((observer)=>{
      this.socket.on('message-from-user',(adminMessage)=>{
        observer.next(adminMessage)
      })
    })
  }

}