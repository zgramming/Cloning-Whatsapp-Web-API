import { Request, Response } from 'express';

import { GroupService } from '../services/group/group.services';
import { errorHandler } from '../utils/error.helper';
import { getUserIdFromToken } from '../utils/token.helper';

export class GroupController {
  static async getGroupById(req: Request, res: Response) {
    const id = req.params.id;
    const group = await GroupService.getGroupById(id);
    return res.status(200).send({
      status: true,
      message: 'Group found successfully',
      data: group,
    });
  }

  static async getGroupByCode(req: Request, res: Response) {
    const code = req.params.code;
    const group = await GroupService.getGroupByCode(code);
    return res.status(200).send({
      status: true,
      message: 'Group found successfully',
      data: group,
    });
  }

  static async getAllGroups(req: Request, res: Response) {
    const groups = await GroupService.getAllGroups();
    return res.status(200).send({
      status: true,
      message: 'Groups found successfully',
      data: groups,
    });
  }

  static async getMyGroup(req: Request, res: Response) {
    const userId = getUserIdFromToken({ req }) || '';
    const groups = await GroupService.getMyGroup(userId);
    return res.status(200).send({
      status: true,
      message: 'Groups found successfully',
      data: groups,
    });
  }

  static async createGroup(req: Request, res: Response) {
    const group = req.body;
    const groupCreated = await GroupService.createGroup(group);
    return res.status(201).send({
      status: true,
      message: 'Group created successfully',
      data: groupCreated,
    });
  }

  static async createPrivateGroup(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const yourId = getUserIdFromToken({ req }) || '';

      const groupCreated = await GroupService.createPrivateGroup({
        userId,
        yourId,
      });
      return res.status(201).send({
        success: true,
        message: 'Private group created successfully',
        data: groupCreated,
      });
    } catch (error) {
      errorHandler(error, req, res);
    }
  }

  static async updateGroup(req: Request, res: Response) {
    const id = req.params.id;
    const group = req.body;
    const groupUpdated = await GroupService.updateGroup(id, group);
    return res.status(200).send({
      status: true,
      message: 'Group updated successfully',
      data: groupUpdated,
    });
  }

  static async deleteGroup(req: Request, res: Response) {
    const id = req.params.id;
    const groupDeleted = await GroupService.deleteGroup(id);
    return res.status(200).send({
      status: true,
      message: 'Group deleted successfully',
      data: groupDeleted,
    });
  }
}
