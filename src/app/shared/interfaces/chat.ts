import { Timestamp } from "firebase/firestore";

export type SidebarChat = [string, LastChatMessage];

export interface LastChatMessage {
  userInfo: {
    displayName: string;
    photoURL: string;
    uid: string;
  },
  lastMessage?: {
    text: string;
  };
  date: Timestamp;
}