import { ConversationType } from "@prisma/client";

export interface ConversationPrivateCreateDTO {
  yourId: string;
  userId: string;
}

export interface ConversationGroupCreateDTO {
  creatorId: string;
  name: string;
  avatar?: Express.Multer.File;
  participants: string[];
}

export interface ConversationUpdateLastMessageDTO {
  conversation_id: string;
  message: string;
  last_sender: string;
}

export interface ConversationCreateDTO {
  name: string;
  code: string;
  avatar?: string;
  type: ConversationType;
}

export interface ConversationUpdateDTO {
  name: string;
  avatar?: string;
}
