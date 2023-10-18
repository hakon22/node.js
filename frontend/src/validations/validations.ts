import * as yup from 'yup';

export default yup.object().shape({
  username: yup
    .string()
    .trim()
    .min(3, 'Минимум 3 символа')
    .max(20, 'Максимум 20 символов')
    .required('Обязательное поле'),
  email: yup
    .string()
    .email('Введите корректный email')
    .trim()
    .required('Обязательное поле'),
  password: yup
    .string()
    .trim()
    .min(6, 'Минимум 6 символов')
    .required('Обязательное поле'),
});
