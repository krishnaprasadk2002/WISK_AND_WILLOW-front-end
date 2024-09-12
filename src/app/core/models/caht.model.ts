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