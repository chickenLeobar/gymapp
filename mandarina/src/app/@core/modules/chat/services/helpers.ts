import { IUserChat } from './../model';

export const orderUserXActive = (arr: IUserChat[]) => {
  return Object.assign([] as IUserChat[], arr).sort((a, b) =>
    a.online == b.online ? 0 : a.online ? -1 : 1
  );
};
