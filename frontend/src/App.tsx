import { useFormik } from 'formik';

interface Values {
  username: string;
  email: string;
  password: string;
}

const App = () => {
  const formik = useFormik<Values>({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    onSubmit: async (values: Values) => {
      try {
        console.log(values);
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>

      <label htmlFor="username">Имя</label>
      <input
        id="username"
        name="username"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.username}
      />
      <label htmlFor="email">Почта</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      <label htmlFor="password">Пароль</label>
      <input
        id="password"
        name="password"
        type="password"
        onChange={formik.handleChange}
        value={formik.values.password}
      />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default App;
