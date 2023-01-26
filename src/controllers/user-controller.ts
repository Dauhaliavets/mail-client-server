import { IMail } from '../models/mail';
import UserModel from '../schemas/userSchema';

const getUser = async (params: string) => {
  const foundedUser = await UserModel.findOne({ name: params });
  if (foundedUser) {
    return foundedUser;
  }
  const newUser = new UserModel({ name: params, mails: [] });
  await newUser.save();
  return newUser;
};

const getUsersName = async () => {
  const foundedUsers = await UserModel.find({}, { name: 1 });
  return foundedUsers;
};

const getUsersByNamePart = async (partName: string) => {
  const foundedUsers = await UserModel.find({ name: { $regex: `${partName}` } }, { name: 1 });
  return foundedUsers;
};

const updateUsers = async (fromUser: string, toUser: string, mail: IMail) => {
  await UserModel.updateMany({ $or: [{ name: fromUser }, { name: toUser }] }, { $push: { mails: mail } });
};

export { getUser, getUsersName, getUsersByNamePart, updateUsers };
