/* eslint-disable react-hooks/exhaustive-deps */
import {
  Form, InputGroup, Spinner, Button,
} from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, FormikProps } from 'formik';
import { Pencil, CheckLg, XLg } from 'react-bootstrap-icons';
import axios from 'axios';
import { capitalize, toLower } from 'lodash';
import notify from '../utilities/toast';
import { userUpdate } from '../slices/userSlice';
import { logAdd } from '../slices/logsSlice';
import createUserValidation from '../validations/validations';
import routes from '../routes';
import { useAppDispatch } from '../utilities/hooks';
import formClass from '../utilities/formClass';
import textFieldGen from '../utilities/textFieldGen';
import checkFieldsEdit from '../utilities/checkFieldsEdit';
import type { FormikUser, PropsUser } from '../types/User';

const UpdateUser = ({ user }: PropsUser) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    id, username, email, password,
  } = user;

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [usernameEdit, setUsernameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);

  const initialValues: FormikUser & { [key: string]: string | number } = {
    username, email, password,
  };

  const setDefaultValue = (field: string, form: FormikProps<FormikUser>) => {
    form.resetForm({ values: initialValues, submitCount: 0 });
    if (field === 'username') {
      setUsernameEdit(false);
    } else if (field === 'email') {
      setEmailEdit(false);
    } else if (field === 'password') {
      form.handleReset();
      setPasswordEdit(false);
    }
  };

  const formik = useFormik<FormikUser>({
    initialValues,
    validationSchema: createUserValidation,
    onSubmit: async (values) => {
      try {
        values.username = capitalize(values.username);
        values.email = toLower(values.email);

        const initialObject: object = {};
        const changedValue = Object.keys(values).reduce((acc, key) => {
          if (initialValues[key] === values[key]) return acc;
          return { [key]: values[key] };
        }, initialObject);

        const { data } = await axios.post(`${routes.updateUser}${id}`, changedValue);

        if (data.code === 1) {
          const field = Object.keys(changedValue)[0];
          dispatch(userUpdate({
            id,
            changes: { ...user, ...changedValue },
          }));
          dispatch(logAdd(data.log));
          setDefaultValue(field, formik);
          notify('Данные успешно изменены', 'success');
        }
      } catch (e) {
        notify('Неизвестная ошибка', 'error');
        console.log(e);
      }
    },
  });

  const usernameControl = { edit: usernameEdit, field: 'username', ref: usernameRef };
  const emailControl = { edit: emailEdit, field: 'email', ref: emailRef };
  const passwordControl = { edit: passwordEdit, field: 'password', ref: passwordRef };

  const controlEditField = (field: string) => {
    if (field === 'username') return { ...usernameControl, setEdit: setUsernameEdit, value: username };
    if (field === 'email') return { ...emailControl, setEdit: setEmailEdit, value: email };
    return { ...passwordControl, setEdit: setPasswordEdit, value: password };
  };

  useEffect(() => {
    checkFieldsEdit(formik, setDefaultValue, usernameControl, emailControl, passwordControl);
  }, [usernameEdit]);

  useEffect(() => {
    checkFieldsEdit(formik, setDefaultValue, emailControl, usernameControl, passwordControl);
  }, [emailEdit]);

  useEffect(() => {
    checkFieldsEdit(formik, setDefaultValue, passwordControl, emailControl, usernameControl);
  }, [passwordEdit]);

  return (
    <Form
      onSubmit={formik.handleSubmit}
      className="col-12 col-xl-10 col-xxl-7 my-2"
    >
      {Object.keys(formik.values).map((key) => {
        const { label, placeholder, type } = textFieldGen(key);
        const {
          edit, ref, setEdit, value,
        } = controlEditField(key);
        return (
          <Form.Group className={formClass(key, formik)} controlId={key} key={key}>
            <Form.Label className="col-12 col-xl-3 text-start">{label}</Form.Label>
            <InputGroup>
              <Form.Control
                ref={ref}
                onChange={formik.handleChange}
                onBlur={() => {
                  if (formik.values[key] === value) {
                    setDefaultValue(key, formik);
                  }
                }}
                isInvalid={!!(formik.errors[key] && formik.submitCount)}
                autoComplete="on"
                type={type}
                value={formik.values[key]}
                data-testid={`${key}-field`}
                name={key}
                placeholder={placeholder}
                disabled={!edit}
              />
              {edit ? (
                <InputGroup.Text
                  id={key}
                  as="button"
                  data-testid={key}
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
                  id={key}
                  role="button"
                  data-testid={key}
                  onClick={() => setEdit(true)}
                >
                  <Pencil />
                </InputGroup.Text>
              )}
              {edit
            && (
            <InputGroup.Text role="button" data-testid={`${key}-close`} onClick={() => setDefaultValue(key, formik)}>
              <XLg className="fw-bold fs-5 text-danger" />
            </InputGroup.Text>
            )}
              <Form.Control.Feedback type="invalid" tooltip>
                {formik.errors[key]}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        );
      })}
      <Button size="sm" variant="warning" className="mt-4" onClick={() => navigate(-1)}>Назад</Button>
    </Form>
  );
};

export default UpdateUser;
