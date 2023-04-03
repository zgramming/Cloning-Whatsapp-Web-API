import { Request, Response } from 'express';

import { GroupService } from '../services/group/group.services';

export class GroupController {
  static async createGroup(req: Request, res: Response) {
    const group = req.body;
    const groupCreated = await GroupService.createGroup(group);
    res.status(201).send({
      message: 'Group created successfully',
      data: groupCreated,
    });
  }

  static async getGroupById(req: Request, res: Response) {
    const id = req.params.id;
    const group = await GroupService.getGroupById(id);
    res.status(200).send({
      message: 'Group found successfully',
      data: group,
    });
  }

  static async getGroupByCode(req: Request, res: Response) {
    const code = req.params.code;
    const group = await GroupService.getGroupByCode(code);
    res.status(200).send({
      message: 'Group found successfully',
      data: group,
    });
  }

  static async getAllGroups(req: Request, res: Response) {
    const groups = await GroupService.getAllGroups();
    res.status(200).send({
      message: 'Groups found successfully',
      data: groups,
    });
  }

  static async updateGroup(req: Request, res: Response) {
    const id = req.params.id;
    const group = req.body;
    const groupUpdated = await GroupService.updateGroup(id, group);
    res.status(200).send({
      message: 'Group updated successfully',
      data: groupUpdated,
    });
  }

  static async deleteGroup(req: Request, res: Response) {
    const id = req.params.id;
    const groupDeleted = await GroupService.deleteGroup(id);
    res.status(200).send({
      message: 'Group deleted successfully',
      data: groupDeleted,
    });
  }
}
