import { useFormik } from 'formik';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { userAdd } from '../slices/userSlice';
import { logAdd } from '../slices/logsSlice';
import routes from '../routes';
import createUserValidation from '../validations/validations';
import { useAppDispatch } from '../utilities/hooks';
import type { FormikUser } from '../types/User';
import toast from '../utilities/toast';
import formClass from '../utilities/formClass';

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
      <Form.Group className={formClass('username', formik)} controlId="username">
        <Form.Label className="col-12 col-xl-3 text-start">Имя</Form.Label>
        <div className="position-relative w-100">
          <Form.Control
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!(formik.errors.username && formik.submitCount)}
            autoComplete="on"
            type="text"
            value={formik.values.username}
            name="username"
            placeholder="Введите имя"
          />
          <Form.Control.Feedback type="invalid" tooltip>
            {formik.errors.username}
          </Form.Control.Feedback>
        </div>
      </Form.Group>
      <Form.Group className={formClass('email', formik)} controlId="email">
        <Form.Label className="col-12 col-xl-3 text-start">Почта</Form.Label>
        <div className="position-relative w-100">
          <Form.Control
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!(formik.errors.email && formik.submitCount)}
            autoComplete="on"
            type="email"
            value={formik.values.email}
            name="email"
            placeholder="Введите почту"
          />
          <Form.Control.Feedback type="invalid" tooltip>
            {formik.errors.email}
          </Form.Control.Feedback>
        </div>
      </Form.Group>
      <Form.Group className={formClass('password', formik)} controlId="password">
        <Form.Label className="col-12 col-xl-3 text-start">Пароль</Form.Label>
        <div className="position-relative w-100">
          <Form.Control
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!(formik.errors.password && formik.submitCount)}
            autoComplete="off"
            type="password"
            value={formik.values.password}
            placeholder="Введите пароль"
            name="password"
          />
          <Form.Control.Feedback type="invalid" tooltip>
            {formik.errors.password}
          </Form.Control.Feedback>
        </div>
      </Form.Group>
      <Button type="submit" variant="primary" size="sm" className="mt-4">Добавить пользователя</Button>
    </Form>
  );
};

export default CreateUser;
