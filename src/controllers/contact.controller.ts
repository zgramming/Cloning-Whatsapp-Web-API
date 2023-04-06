import { Request, Response } from 'express';

import { ContactService } from '../services/contact/contact.services';
import { getUserIdFromToken } from '../utils/token.helper';

export class ContactController {
  static async getContactsByOwnerId(req: Request, res: Response) {
    const ownerId = getUserIdFromToken({ req }) || '';
    const contacts = await ContactService.getContactsByOwnerId(ownerId);
    return res.status(200).json({
      status: true,
      message: 'Contacts fetched successfully',
      data: contacts,
    });
  }

  static async createContact(req: Request, res: Response) {
    const { group_id, user_id } = req.body;
    const ownerId = getUserIdFromToken({ req }) || '';
    const contact = await ContactService.createContact({ owner_id: ownerId, group_id, user_id });
    return res.status(201).json({
      status: true,
      message: 'Contact created successfully',
      data: contact,
    });
  }
}
