import { Request, Response } from 'express';

import { PATH_ACTUAL_GROUP_IMAGE_PROFILE, PATH_TEMPORARY_GROUP_IMAGE_PROFILE } from '../utils/constant';
import { errorHandler } from '../utils/error.helper';
import { FN } from '../utils/function';
import { getUserIdFromToken } from '../utils/token.helper';
import { ConversationService } from '../services/conversation/conversation.services';

export class ConversationController {
  static async getById(req: Request, res: Response) {
    const id = req.params.id;
    const userId = getUserIdFromToken({ req }) || '';

    const conversation = await ConversationService.getById(id);

    if (conversation.type === 'PRIVATE') {
      const interlocutors = conversation.participants.find((participant) => participant.user_id !== userId);

      if (!interlocutors) {
        return res.status(404).send({
          status: false,
          message: 'Lawan bicara tidak ditemukan',
          data: null,
        });
      }

      return res.status(200).send({
        status: true,
        message: 'Conversation found successfully',
        data: {
          ...conversation,
          interlocutors,
        },
      });
    }

    return res.status(200).send({
      status: true,
      message: 'Conversation found successfully',
      data: conversation,
    });
  }

  static async getByCode(req: Request, res: Response) {
    const code = req.params.code;
    const result = await ConversationService.getByCode(code);
    return res.status(200).send({
      status: true,
      message: 'Conversation found successfully',
      data: result,
    });
  }

  static async getMyConversations(req: Request, res: Response) {
    const userId = getUserIdFromToken({ req }) || '';
    const result = await ConversationService.getMyConversations(userId);

    return res.status(200).send({
      status: true,
      message: 'Conversations found successfully',
      data: result,
    });
  }

  static async createPrivateConversation(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const yourId = getUserIdFromToken({ req }) || '';

      const result = await ConversationService.createPrivateConversation({
        userId,
        yourId,
      });

      return res.status(201).send({
        success: true,
        message: 'Private group created successfully',
        data: result,
      });
    } catch (error) {
      return errorHandler(error, req, res);
    }
  }

  static async createGroupConversation(req: Request, res: Response) {
    try {
      const { name, participants } = req.body;

      const avatar = req.file;
      const yourId = getUserIdFromToken({ req }) || '';

      const participantWithMe = [...participants, yourId];
      const result = await ConversationService.createGroupConversation({
        creatorId: yourId,
        name,
        participants: participantWithMe,
        avatar,
      });

      /// Upload group avatar to server if avatar is not null
      if (avatar) {
        const from = `${PATH_TEMPORARY_GROUP_IMAGE_PROFILE}/${avatar.filename}`;
        const to = `${PATH_ACTUAL_GROUP_IMAGE_PROFILE}/${result.avatar}`;
        FN.moveAndDeleteOldFile(from, to);
      }

      return res.status(201).send({
        success: true,
        message: 'Group conversation created successfully',
        data: result,
      });
    } catch (error) {
      return errorHandler(error, req, res);
    }
  }

  static async update(req: Request, res: Response) {
    const id = req.params.id;
    const { name, avatar } = req.body;
    const result = await ConversationService.update(id, {
      name,
      avatar,
    });
    return res.status(200).send({
      status: true,
      message: 'Group updated successfully',
      data: result,
    });
  }

  static async delete(req: Request, res: Response) {
    const id = req.params.id;
    const result = await ConversationService.delete(id);
    return res.status(200).send({
      status: true,
      message: 'Group deleted successfully',
      data: result,
    });
  }
}
