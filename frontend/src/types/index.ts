// src/types/index.ts

export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  created_at?: string;
}

export interface Message {
  _id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  sent_at: string;
}
