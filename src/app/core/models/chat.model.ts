import { User } from "./user.model";

export interface Conversation {
  id: string;
  participants: string[];
  messages: IChatMessage[];
}

export interface IChatMessage {
  user: string; 
  message: string;
  timestamp?: Date;
}


export interface IConversation {
  _id: string; 
  conversationid: string; 
  participants: string[]; 
  messages: IChatMessage[];   
}

export interface IConversationwithUser {
  _id: string; 
  conversationid: string; 
  participants: User[]; 
  messages: IChatMessage[]; 

}
