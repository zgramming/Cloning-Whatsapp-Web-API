import { Request, Response } from 'express';
import { MessageService } from '../services/message/message.services';

import { errorHandler } from '../utils/error.helper';
import { getUserIdFromToken } from '../utils/token.helper';

export class MessageController {
  static async getByConversationId(req: Request, res: Response) {
    try {
      const { conversation_id } = req.params;

      const messages = await MessageService.getByConversationId(conversation_id);

      return res.status(200).json({
        success: true,
        message: 'Messages',
        data: messages,
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  static async createMessage(req: Request, res: Response) {
    try {
      const { conversation_id, message, type } = req.body;

      const from = getUserIdFromToken({ req }) || '';

      const messageCreated = await MessageService.create({
        from,
        conversation_id,
        message,
        type,
      });

      return res.status(201).json({
        success: true,
        message: 'Message created',
        data: messageCreated,
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }
}
