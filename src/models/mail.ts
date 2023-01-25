import { Types } from 'mongoose';

interface IMail {
  from: Types.ObjectId;
  to: Types.ObjectId;
  title: string;
  body: string;
}

export { IMail };
