export type FormikUser = {
  username: string;
  email: string;
  password: string;
  [key: string]: string;
}

export type User = FormikUser & {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export type PropsUser = {
  user: User;
}

export type PropsUsers = {
  users: User[];
}
