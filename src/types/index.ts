export interface Summary {
  text: string;
  tags: string[];
  handle: string;
  timestamp: number;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}
