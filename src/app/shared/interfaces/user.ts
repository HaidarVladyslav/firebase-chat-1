export type AddUserData = {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
};

export interface UserData extends AddUserData { }
