import { GroupType } from '@prisma/client';

export interface GroupPrivateCreateDTO {
  yourId: string;
  userId: string;
}

export interface GroupGroupCreateDTO {
  creatorId: string;
  name: string;
  avatar?: Express.Multer.File;
  participants: string[];
}

export interface GroupUpdateLastMessageDTO {
  groupId: string;
  message: string;
  last_sender: string;
}

export interface GroupCreateDTO {
  name: string;
  code: string;
  avatar?: string;
  type: GroupType;
}

export interface GroupUpdateDTO {
  name: string;
  avatar?: string;
}
