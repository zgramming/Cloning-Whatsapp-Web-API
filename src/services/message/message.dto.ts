import { TypeMessage } from '@prisma/client';

export interface MessageCreateDTO {
  conversation_id: string;
  from: string;
  message: string;
  type: TypeMessage;
}
