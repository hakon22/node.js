export type FormikUser = {
  username: string;
  email: string;
  password: string;
}

export type User = FormikUser & {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export type PropsUser = {
  id: number;
  username: string;
  email: string;
  password: string;
}
