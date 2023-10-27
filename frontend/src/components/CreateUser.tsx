import { useFormik } from 'formik';
import axios from 'axios';
import { capitalize, toLower } from 'lodash';
import { Form, Button } from 'react-bootstrap';
import { userAdd } from '../slices/userSlice';
import { logAdd } from '../slices/logsSlice';
import routes from '../routes';
import createUserValidation from '../validations/validations';
import { useAppDispatch } from '../utilities/hooks';
import type { FormikUser } from '../types/User';
import toast from '../utilities/toast';
import formClass from '../utilities/formClass';
import textFieldGen from '../utilities/textFieldGen';

const CreateUser = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik<FormikUser>({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: createUserValidation,
    onSubmit: async (values, { resetForm }) => {
      try {
        values.username = capitalize(values.username);
        values.email = toLower(values.email);
        const { data } = await axios.post(routes.addUser, values);
        dispatch(userAdd(data.user));
        dispatch(logAdd(data.log));
        resetForm();
        toast('Пользователь добавлен', 'success');
      } catch (e) {
        toast('Не удалось добавить пользователя', 'error');
        console.log(e);
      }
    },
  });

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className="col-12 col-xl-10 my-2"
    >
      {Object.keys(formik.values).map((key) => {
        const { label, placeholder, type } = textFieldGen(key);
        return (
          <Form.Group className={formClass(key, formik)} controlId={key} key={key}>
            <Form.Label className="col-12 col-xl-3 text-start">{label}</Form.Label>
            <div className="position-relative w-100">
              <Form.Control
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.errors[key] && formik.submitCount)}
                autoComplete="on"
                type={type}
                value={formik.values[key]}
                name={key}
                placeholder={placeholder}
              />
              <Form.Control.Feedback type="invalid" data-testid={`${key}-invalid`} tooltip>
                {formik.errors[key]}
              </Form.Control.Feedback>
            </div>
          </Form.Group>
        );
      })}
      <Button type="submit" variant="primary" size="sm" className="mt-4">Добавить пользователя</Button>
    </Form>
  );
};

export default CreateUser;
