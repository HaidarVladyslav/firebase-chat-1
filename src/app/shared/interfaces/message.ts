import { Timestamp } from "firebase/firestore";

export interface Message {
  id: string;
  text: string;
  date: Timestamp;
  sender: string;
  img?: string;
}