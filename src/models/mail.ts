import { Types } from 'mongoose';

interface IMail {
  from: string;
  to: string;
  title: string;
  body: string;
}

export { IMail };
