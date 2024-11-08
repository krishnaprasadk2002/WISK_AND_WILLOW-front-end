import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IChatMessage, IConversation } from '../../../core/models/chat.model';


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
  chat:IChatMessage[]= [] 
  currentUser: { id: string, email: string } = { id: '', email: '' };
  conversationId!:string

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.connect();
    this.chatService.getMessages().subscribe((data: IChatMessage) => {
      this.messages.push(data); 
      this.scrollToBottom();   
  });

    this.getChats()
    this.getConversationId()
  }

  getChats(){
    this.chatService.getChats().subscribe(chat=>{
      
     this.chat = chat
    })
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
      let message = {
        user: 'user',
        message: this.message,
        timestamp: new Date()
    }
        this.chatService.sendMessage(this.conversationId, message).subscribe();
        this.messages.push(message)
        this.message = '';
    }
}

getConversationId() {
  this.chatService.getConversationId().subscribe((conversationId: IConversation) => {
    this.messages.push(...conversationId.messages)
    console.log('messages of data',this.messages);
    
    this.conversationId = conversationId.conversationid ;

    this.chatService.joinConversation(this.conversationId).subscribe()
  });
}

isUserMessage(message: IChatMessage): boolean {
  return message.user === 'user';
}

}