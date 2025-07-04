export interface Summary {
  text: string;
  tags: string[];
  handle: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}
