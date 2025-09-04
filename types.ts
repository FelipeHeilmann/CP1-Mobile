import { User } from './services/user-service';

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
