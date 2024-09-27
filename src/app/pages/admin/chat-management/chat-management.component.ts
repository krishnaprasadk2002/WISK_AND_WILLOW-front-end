import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { IChatMessage, IConversationwithUser } from '../../../core/models/chat.model';

@Component({
  selector: 'app-chat-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-management.component.html',
  styleUrl: './chat-management.component.css'
})

export class ChatManagementComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  conversations: IConversationwithUser[] = [];
  selectedConversation: IConversationwithUser | null = null;
  newMessage: string = '';
  currentUser: string = 'admin';
  defaultImageUrl!: string;

  constructor(private chatService: ChatService) { }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.getConversations();
    this.chatService.connect()
    this.getAdminChatMessage();

  }

  getConversations() {
    this.chatService.getConversationData().subscribe(conversations => {
      this.conversations = conversations;
      console.log(conversations, 'conversation');
      
    });
  }

  getAdminChatMessage() {
    this.chatService.getAdminMessages().subscribe((data: any) => {
      const newmess = this.conversations.map((res) => {
        if (res.conversationid == data.conversationId) {
          res.messages.push(data)
        }
        return res
      })
      this.conversations = [...newmess]

    });
  }


  selectConversation(convo: IConversationwithUser): void {
    this.selectedConversation = convo;
    setTimeout(() => this.scrollToBottom(), 0);
  }

  sendMessage() {
    if (this.selectedConversation && this.newMessage.trim()) {
      const message: IChatMessage = {
        user: this.currentUser,
        message: this.newMessage,
        timestamp: new Date()
      };
      this.selectedConversation.messages.push(message);

      this.chatService.sendMessageAdmin(this.selectedConversation.conversationid, message).subscribe(
        response => {
          if (this.selectedConversation) {

            this.selectedConversation.messages.push(message);
            console.log('fdjwksaljl');

          }

        },
        error => console.error('Error sending message:', error)
      );

      this.newMessage = '';
      this.scrollToBottom()
    }
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  getImageUrl(user: User): string {
    return user.imageUrl && user.imageUrl.trim() !== ''
      ? user.imageUrl
      : this.defaultImageUrl;
  }

  isAdminMessage(message: IChatMessage): boolean {
    return message.user === this.currentUser;
  }
}