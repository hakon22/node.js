import { useFormik } from 'formik';
import axios from 'axios';
import routes from '../routes';

type Values = {
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
    onSubmit: async (values) => {
      try {
        await axios.post(values, routes.addUser);
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <div className="container d-flex justify-content-center">
      <form onSubmit={formik.handleSubmit} className="mt-4 col-4">
        <div className="mb-3">
          <label htmlFor="username" className="col-3">Имя</label>
          <input
            className="col-9"
            id="username"
            name="username"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="col-3">Почта</label>
          <input
            className="col-9"
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="col-3">Пароль</label>
          <input
            className="col-9"
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit">Зарегистрироваться</button>
        </div>
      </form>
    </div>
  );
};

export default App;
