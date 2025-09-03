import { User } from './userStorage';

export type RootStackParamList = {
  UserList: undefined;
  CreateUser: undefined;
  EditUser: { user: User };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
