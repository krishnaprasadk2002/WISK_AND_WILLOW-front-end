import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IChatMessage } from '../../../core/models/caht.model';
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  user: string;
  message: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  message: string = '';
  messages: IChatMessage[] = [];
  currentUser: { id: string, email: string } = { id: '', email: '' };

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.connect();
    
    this.chatService.getMessages().subscribe((data: IChatMessage) => {
      this.messages.push(data);
      this.scrollToBottom();
    });

    this.getUserDetails();
  }

  getUserDetails() {
    this.chatService.getUserDetails().subscribe(user => {
      this.currentUser.email = user.email || '';
      this.currentUser.id = uuidv4();
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.currentUser.id, {
        user: this.currentUser.email,
        message: this.message,
        timestamp: new Date()
      }).subscribe();
      
      this.message = '';
    }
  }
}