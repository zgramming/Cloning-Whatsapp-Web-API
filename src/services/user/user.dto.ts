import { StatusUser } from '@prisma/client';

export interface UserCreateDTO {
  name: string;
  password: string;
  phone: string;
  avatar?: string;
  status: StatusUser;
}

export interface UserUpdateDTO {
  name: string;
  bio?: string;
}
