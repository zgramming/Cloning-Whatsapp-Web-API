import { TypeMessage } from '@prisma/client';

export interface MessageCreateDTO {
  group_id: string;
  from: string;
  message: string;
  type: TypeMessage;
}
