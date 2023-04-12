import { PrismaClient } from '@prisma/client';

import { ContactCreateDTO } from './contact.dto';

const prisma = new PrismaClient();
export class ContactService {
  static async getContactsByOwnerId(ownerId: string) {
    console.log(ownerId);

    const contacts = await prisma.contact.findMany({
      where: {
        owner_id: ownerId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });

    return contacts;
  }

  static async createContact({ owner_id, conversation_id, user_id }: ContactCreateDTO) {
    const result = await prisma.contact.create({
      data: {
        owner_id,
        conversation_id,
        user_id,
      },
    });

    return result;
  }
}
