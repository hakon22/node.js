import cn from 'classnames';
import { FormikProps } from 'formik';
import type { FormikUser } from '../types/User';

const formClass = (field: string, formik: FormikProps<FormikUser & { [key: string]: unknown }>) => cn('d-flex flex-wrap flex-md-nowrap align-items-center mb-2', {
  'mb-3-5': formik.errors[field] && formik.touched[field] && formik.submitCount,
});

export default formClass;
