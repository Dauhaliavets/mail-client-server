import { Types } from 'mongoose';
import { IMail } from './mail';

interface IUser {
  _id: Types.ObjectId;
  name: string;
  mails: IMail[];
}

export { IUser }