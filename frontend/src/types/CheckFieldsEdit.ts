import { FormikProps } from 'formik';
import type { FormikUser } from './User';

export type Control = {
  edit: boolean;
  field: string;
  ref: React.RefObject<HTMLInputElement>;
}

export type CheckFieldsEditTypes = (
  formik: FormikProps<FormikUser>,
  setDefaultValue: (field: string, form: FormikProps<FormikUser>) => void,
  general: Control,
  ...other: Control[]
) => void;
