import mongoose from 'mongoose';
import { IUser } from '../models/user';

const Schema = mongoose.Schema;

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  mails: [],
});

const UserModel = mongoose.model('users', userSchema);
export default UserModel;
