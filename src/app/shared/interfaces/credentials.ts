export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends Credentials {
  displayName: string;
  photoURL: string;
}