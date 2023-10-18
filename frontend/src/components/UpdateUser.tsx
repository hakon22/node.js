/* eslint-disable react-hooks/exhaustive-deps */
import {
  Form, InputGroup, Spinner, Button,
} from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, FormikContextType } from 'formik';
import { Pencil, CheckLg, XLg } from 'react-bootstrap-icons';
import axios from 'axios';
import { capitalize, toLower } from 'lodash';
import notify from '../utilities/toast';
import { userUpdate } from '../slices/userSlice';
import createUserValidation from '../validations/validations';
import routes from '../routes';
import { useAppDispatch } from '../utilities/hooks';
import formClass from '../utilities/formClass';
import type { FormikUser, PropsUser } from '../types/User';

const ChangeData = ({
  id, username, email, password,
}: PropsUser) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [usernameEdit, setUsernameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);

  const initialValues: FormikUser & { [key: string]: string | number } = {
    username, email, password,
  };

  const setDefaultValue = (field: string, form: FormikContextType<FormikUser>) => {
    if (field !== 'password') {
      form.resetForm({ values: initialValues, submitCount: 0 });
    }
    if (field === 'username') {
      setUsernameEdit(false);
    } else if (field === 'email') {
      setEmailEdit(false);
    } else if (field === 'password') {
      form.handleReset();
      setPasswordEdit(false);
    }
  };

  const formik = useFormik<FormikUser & { [key: string]: unknown }>({
    initialValues,
    validationSchema: createUserValidation,
    onSubmit: async (values) => {
      try {
        if (values.username) {
          values.username = capitalize(values.username);
        }
        if (values.email) {
          values.email = toLower(values.email);
        }
        const initialObject: object = {};
        const changedValue = Object.keys(values).reduce((acc, key) => {
          if (initialValues[key] === values[key]) {
            return acc;
          }
          return { [key]: values[key] };
        }, initialObject);

        const { data } = await axios.post(`${routes.updateUser}${id}`, changedValue);

        if (data.code === 1) {
          const field = Object.keys(changedValue)[0];
          dispatch(userUpdate({
            id,
            changes: {
              username, password, email, ...changedValue,
            },
          }));
          setDefaultValue(field, formik);
          notify('Данные успешно изменены', 'success');
        }
      } catch (e) {
        notify('Неизвестная ошибка', 'error');
        console.log(e);
      }
    },
  });

  useEffect(() => {
    if (usernameEdit) {
      if (emailEdit) {
        setDefaultValue('email', formik);
      }
      if (passwordEdit) {
        setDefaultValue('password', formik);
      }
      if (usernameRef.current) {
        usernameRef.current.select();
      }
    } else {
      setDefaultValue('username', formik);
    }
  }, [usernameEdit]);

  useEffect(() => {
    if (emailEdit) {
      if (usernameEdit) {
        setDefaultValue('username', formik);
      }
      if (passwordEdit) {
        setDefaultValue('password', formik);
      }
      if (emailRef.current) {
        emailRef.current.select();
      }
    } else {
      setDefaultValue('email', formik);
    }
  }, [emailEdit]);

  useEffect(() => {
    if (passwordEdit) {
      if (emailEdit) {
        setDefaultValue('email', formik);
      }
      if (usernameEdit) {
        setDefaultValue('username', formik);
      }
      if (passwordRef.current) {
        passwordRef.current.select();
      }
    } else {
      setDefaultValue('password', formik);
    }
  }, [passwordEdit]);

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className="col-12 col-xl-10 col-xxl-7 my-2"
    >
      <Form.Group className={formClass('username', formik)} controlId="username">
        <Form.Label className="col-12 col-xl-3 text-start">Имя</Form.Label>
        <InputGroup>
          <Form.Control
            ref={usernameRef}
            onChange={formik.handleChange}
            onBlur={() => {
              if (formik.values.username === username) {
                setDefaultValue('username', formik);
              }
            }}
            isInvalid={!!(formik.errors.username && formik.submitCount)}
            autoComplete="on"
            type="text"
            value={formik.values.username}
            name="username"
            placeholder="Введите имя"
            disabled={!usernameEdit}
          />
          {usernameEdit ? (
            <InputGroup.Text
              id="username"
              as="button"
              type="submit"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting
                ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    variant="success"
                  />
                )
                : <CheckLg className="fw-bold fs-4 text-success" />}
            </InputGroup.Text>
          ) : (
            <InputGroup.Text
              id="username"
              role="button"
              onClick={() => setUsernameEdit(true)}
            >
              <Pencil />
            </InputGroup.Text>
          )}
          {usernameEdit
          && (
          <InputGroup.Text role="button" onClick={() => setDefaultValue('username', formik)}>
            <XLg className="fw-bold fs-5 text-danger" />
          </InputGroup.Text>
          )}
          <Form.Control.Feedback type="invalid" tooltip>
            {formik.errors.username}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group className={formClass('email', formik)} controlId="email">
        <Form.Label className="col-12 col-xl-3 text-start">Почта</Form.Label>
        <InputGroup>
          <Form.Control
            ref={emailRef}
            onChange={formik.handleChange}
            onBlur={() => {
              if (formik.values.email === email) {
                setDefaultValue('email', formik);
              }
            }}
            isInvalid={!!(formik.errors.email && formik.submitCount)}
            autoComplete="on"
            type="email"
            value={formik.values.email}
            name="email"
            placeholder="Введите почту"
            disabled={!emailEdit}
          />
          {emailEdit ? (
            <InputGroup.Text
              id="email"
              as="button"
              type="submit"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting
                ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    variant="success"
                  />
                )
                : <CheckLg className="fw-bold fs-4 text-success" />}
            </InputGroup.Text>
          ) : (
            <InputGroup.Text
              id="email"
              role="button"
              onClick={() => setEmailEdit(true)}
            >
              <Pencil />
            </InputGroup.Text>
          )}
          {emailEdit
          && (
          <InputGroup.Text role="button" onClick={() => setDefaultValue('email', formik)}>
            <XLg className="fw-bold fs-5 text-danger" />
          </InputGroup.Text>
          )}
          <Form.Control.Feedback type="invalid" tooltip>
            {formik.errors.email}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group className={formClass('password', formik)} controlId="password">
        <Form.Label className="col-12 col-xl-3 text-start">Пароль</Form.Label>
        <InputGroup>
          <Form.Control
            ref={passwordRef}
            onChange={formik.handleChange}
            onBlur={() => {
              if (formik.values.password === password) {
                setDefaultValue('password', formik);
              }
            }}
            isInvalid={!!(formik.errors.password && formik.submitCount)}
            autoComplete="off"
            type="password"
            value={formik.values.password}
            placeholder="Введите пароль"
            name="password"
            disabled={!passwordEdit}
          />
          {passwordEdit ? (
            <InputGroup.Text
              id="password"
              as="button"
              type="submit"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting
                ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    variant="success"
                  />
                )
                : <CheckLg className="fw-bold fs-4 text-success" />}
            </InputGroup.Text>
          ) : (
            <InputGroup.Text
              id="password"
              role="button"
              onClick={() => setPasswordEdit(true)}
            >
              <Pencil />
            </InputGroup.Text>
          )}
          {passwordEdit
          && (
          <InputGroup.Text role="button" onClick={() => setDefaultValue('password', formik)}>
            <XLg className="fw-bold fs-5 text-danger" />
          </InputGroup.Text>
          )}
          <Form.Control.Feedback type="invalid" tooltip>
            {formik.errors.password}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Button size="sm" variant="warning" className="mt-4" onClick={() => navigate(routes.homePage)}>На главную</Button>
    </Form>
  );
};

export default ChangeData;
