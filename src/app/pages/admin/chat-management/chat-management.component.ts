import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { IChatMessage } from '../../../core/models/caht.model';

interface ChatUser extends User {
  _id: string;
  lastMessage?: string;
  unreadCount?: number;
  lastMessageTime?: Date;
}

@Component({
  selector: 'app-chat-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-management.component.html',
  styleUrl: './chat-management.component.css'
})

  export class ChatManagementComponent implements OnInit {
    users: ChatUser[] = [];
  selectedUser: ChatUser | null = null;
  newMessage: string = '';
  selectedConversationId: string = '';
  currentUser: string = 'admin'; 

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    
    this.chatService.getUserDetails().subscribe((userData: ChatUser[]) => {
      this.users = userData.map(user => ({
        ...user,
        lastMessage: 'No messages yet', 
        unreadCount: 0,
        lastMessageTime: new Date() 
      }));
      console.log('Users fetched:', this.users);
    });
  }

  selectUser(user: ChatUser): void {
    this.selectedUser = user;

    this.chatService.getChatHistory(user._id).subscribe((history) => {
      console.log('Chat history received:', history);
    });

    this.chatService.createConversation([this.selectedUser._id, this.currentUser]).subscribe(conversation => {
      this.selectedConversationId = conversation._id;
      console.log('Conversation created or fetched:', this.selectedConversationId);
    });
  }

  sendMessage() {
    if (this.selectedConversationId && this.newMessage.trim()) {
      const message: IChatMessage = {
        user: this.currentUser,
        message: this.newMessage,
        timestamp: new Date()
      };
      this.chatService.sendMessage(this.selectedConversationId, message).subscribe();
      this.newMessage = '';
    }
  }
  }