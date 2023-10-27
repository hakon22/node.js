import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import React from 'react';
import axios from 'axios';
import App from '../src/components/App';
import store from '../src/slices/index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const checkCountElements = async (testId: string, toHaveLength: number) => waitFor(async () => {
  const items = await screen.findAllByTestId(testId);

  expect(items).toHaveLength(toHaveLength);
});

window.HTMLElement.prototype.scrollIntoView = () => {};

const createdAt = new Date().toISOString();
const updatedAt = new Date().toISOString();

let response: { data: { code: number, users?: object, logs?: object, user?: object, log?: object }};
const errorResponce = new Error();

beforeEach(() => {
  const users = [{
    id: 1, username: 'alex', email: 'hakon@emnail.ri', password: 'gfhfghfh', createdAt, updatedAt,
  }];

  const logs = [{
    id: 1, userId: 1, message: 'Создан пользователь alex', createdAt, updatedAt,
  }];

  response = { data: { code: 1, users, logs } };
  mockedAxios.get.mockResolvedValue(response);

  waitFor(() => {
    render(
      <Provider store={store}>
        <ToastContainer />
        <App />
      </Provider>,
    );
  });
});

describe('testing data', () => {
  it('fetch data', async () => {
    await userEvent.click(screen.getByText('Пользователи'));

    expect(screen.getByText('alex')).toHaveTextContent('alex');
  });

  it('create user', async () => {
    const user = {
      id: 2, username: 'Алёша', email: 'hakon1@mail.ru', password: '111111', createdAt, updatedAt,
    };
    const log = {
      id: 2, userId: 2, message: 'Создан пользователь Алёша', createdAt, updatedAt,
    };
    response = { data: { code: 1, user, log } };
    mockedAxios.post.mockResolvedValue(response);

    await userEvent.click(screen.getByText('Главная'));

    const inputName = screen.getByLabelText('Имя');
    const inputEmail = screen.getByLabelText('Почта');
    const inputPassword = screen.getByLabelText('Пароль');

    await userEvent.type(inputName, 'Алёша');
    await userEvent.type(inputEmail, 'hakon1@mail.ru');
    await userEvent.type(inputPassword, '111111');

    await userEvent.click(screen.getByText('Добавить пользователя'));
    await userEvent.click(screen.getByText('Пользователи'));

    expect(screen.getByText('alex')).toHaveTextContent('alex');
    expect(screen.getByText('Алёша')).toHaveTextContent('Алёша');
  });

  it('logs', async () => {
    await userEvent.click(screen.getByText('Логи'));

    expect(screen.getByText('Создан пользователь alex')).toHaveTextContent('Создан пользователь alex');
    expect(screen.getByText('Создан пользователь Алёша')).toHaveTextContent('Создан пользователь Алёша');
  });
});

describe('testing pagination', () => {
  it('create many users and pagination', async () => {
    let userId = 3;
    const createManyUsers = async (id: number) => {
      const user = {
        id, username: 'Алёша', email: 'hakon1@mail.ru', password: '111111', createdAt, updatedAt,
      };
      const log = {
        id, userId: id, message: 'Создан пользователь Алёша', createdAt, updatedAt,
      };
      response = { data: { code: 1, user, log } };
      mockedAxios.post.mockResolvedValue(response);

      const inputName = screen.getByLabelText('Имя');
      const inputEmail = screen.getByLabelText('Почта');
      const inputPassword = screen.getByLabelText('Пароль');

      await userEvent.click(screen.getByText('Добавить пользователя'));

      expect(screen.getByTestId('username-invalid')).toHaveTextContent('Обязательное поле');
      expect(screen.getByTestId('email-invalid')).toHaveTextContent('Обязательное поле');
      expect(screen.getByTestId('password-invalid')).toHaveTextContent('Обязательное поле');

      await userEvent.type(inputName, 'Алёша');
      await userEvent.type(inputEmail, 'hakon1@mail.ru');
      await userEvent.type(inputPassword, '111111');

      await userEvent.click(screen.getByText('Добавить пользователя'));
      if (userId < 13) {
        userId += 1;
        await createManyUsers(userId);
      }
    };

    await userEvent.click(screen.getByText('Главная'));

    await createManyUsers(userId);

    await userEvent.click(screen.getByText('Логи'));
    await userEvent.click(screen.getByRole('button', { name: '2' }));

    expect(screen.getByText('Создан пользователь alex')).toHaveTextContent('Создан пользователь alex');
  }, 25000);
});

describe('testing user update', () => {
  it('username update', async () => {
    const log = {
      id: 14, userId: 13, message: 'Пользователь #13 изменил username на Валентин', createdAt, updatedAt,
    };
    response = { data: { code: 1, log } };
    mockedAxios.post.mockResolvedValue(response);

    await userEvent.click(screen.getByText('Пользователи'));
    await userEvent.click(screen.getByText('13'));

    expect(screen.getByTestId('username-field')).toBeDisabled();

    await userEvent.click(screen.getByTestId('username'));

    expect(screen.getByTestId('username-field')).toBeEnabled();

    await userEvent.clear(screen.getByTestId('username-field'));

    const inputName = screen.getByLabelText('Имя');
    await userEvent.type(inputName, 'валентин');

    await userEvent.click(screen.getByTestId('username'));

    expect(screen.getByTestId('username-field')).toBeDisabled();
    expect(await screen.findByText('Данные успешно изменены')).toBeInTheDocument();
    expect(screen.getByText('Валентин')).toHaveTextContent('Валентин');
    expect(store.getState().users.entities[13]?.username).toBe('Валентин');

    await userEvent.click(screen.getByText('Логи'));

    expect(screen.getByText('Пользователь #13 изменил username на Валентин')).toHaveTextContent('Пользователь #13 изменил username на Валентин');
  });

  it('email update', async () => {
    const log = {
      id: 15, userId: 13, message: 'Пользователь #13 изменил email на valentin@mail.ru', createdAt, updatedAt,
    };
    response = { data: { code: 1, log } };
    mockedAxios.post.mockResolvedValue(response);

    await userEvent.click(screen.getByText('Пользователи'));
    await userEvent.click(screen.getByText('Валентин'));

    expect(screen.getByTestId('email-field')).toBeDisabled();

    await userEvent.click(screen.getByTestId('email'));

    expect(screen.getByTestId('email-field')).toBeEnabled();

    await userEvent.clear(screen.getByTestId('email-field'));

    const inputEmail = screen.getByLabelText('Почта');
    await userEvent.type(inputEmail, 'VaLeNtIn@mail.ru');

    await userEvent.click(screen.getByTestId('email'));

    expect(screen.getByTestId('email-field')).toBeDisabled();
    expect(await screen.findByText('Данные успешно изменены')).toBeInTheDocument();
    expect(store.getState().users.entities[13]?.email).toBe('valentin@mail.ru');

    await userEvent.click(screen.getByText('Логи'));

    expect(screen.getByText('Пользователь #13 изменил email на valentin@mail.ru')).toHaveTextContent('Пользователь #13 изменил email на valentin@mail.ru');
  });

  it('password update', async () => {
    const log = {
      id: 16, userId: 13, message: 'Пользователь #13 изменил password на superpass', createdAt, updatedAt,
    };
    response = { data: { code: 1, log } };
    mockedAxios.post.mockResolvedValue(response);

    await userEvent.click(screen.getByText('Пользователи'));
    await userEvent.click(screen.getByText('Валентин'));

    expect(screen.getByTestId('password-field')).toBeDisabled();

    await userEvent.click(screen.getByTestId('password'));

    expect(screen.getByTestId('password-field')).toBeEnabled();

    await userEvent.clear(screen.getByTestId('password-field'));

    const inputPassword = screen.getByLabelText('Пароль');
    await userEvent.type(inputPassword, 'superpass');

    await userEvent.click(screen.getByTestId('password'));

    expect(screen.getByTestId('password-field')).toBeDisabled();
    expect(await screen.findByText('Данные успешно изменены')).toBeInTheDocument();
    expect(store.getState().users.entities[13]?.password).toBe('superpass');

    await userEvent.click(screen.getByText('Логи'));

    expect(screen.getByText('Пользователь #13 изменил password на superpass')).toHaveTextContent('Пользователь #13 изменил password на superpass');
  });

  it('update password with error', async () => {
    mockedAxios.post.mockResolvedValue(errorResponce);

    await userEvent.click(screen.getByText('Пользователи'));
    await userEvent.click(screen.getByText('Валентин'));

    expect(screen.getByTestId('password-field')).toBeDisabled();

    await userEvent.click(screen.getByTestId('password'));

    expect(screen.getByTestId('password-field')).toBeEnabled();

    await userEvent.clear(screen.getByTestId('password-field'));

    const inputPassword = screen.getByLabelText('Пароль');
    await userEvent.type(inputPassword, 'superpass2');

    await userEvent.click(screen.getByTestId('password'));

    expect(screen.getByTestId('password-field')).toBeEnabled();
    expect(await screen.findByText('Неизвестная ошибка')).toBeInTheDocument();
    expect(store.getState().users.entities[13]?.password).toBe('superpass');
  });
});

describe('testing userPage', () => {
  it('isDisabled on blur', async () => {
    await userEvent.click(screen.getByText('Пользователи'));
    await userEvent.click(screen.getByText('Валентин'));

    await userEvent.click(screen.getByTestId('username'));
    await userEvent.click(screen.getByTestId('email'));
    await userEvent.click(screen.getByTestId('password'));
    await userEvent.click(screen.getByTestId('password-close'));

    expect(screen.getByTestId('username-field')).toBeDisabled();
    expect(screen.getByTestId('email-field')).toBeDisabled();
    expect(screen.getByTestId('password-field')).toBeDisabled();
  });
});

describe('testing searchForId in logs', () => {
  it('search #13', async () => {
    await userEvent.click(screen.getByText('Логи'));

    const inputSearch = screen.getByLabelText('Введите id пользователя');
    await userEvent.type(inputSearch, 'text');

    expect(inputSearch).toHaveValue('');

    await userEvent.type(inputSearch, '13');
    await userEvent.keyboard('{Enter}');

    await checkCountElements('tr', 4);
  });

  it('search #5', async () => {
    await userEvent.click(screen.getByText('Логи'));

    const inputSearch = screen.getByLabelText('Введите id пользователя');

    await userEvent.type(inputSearch, '5');
    await userEvent.keyboard('{Enter}');

    await checkCountElements('tr', 1);
  });

  it('cancel search', async () => {
    await userEvent.click(screen.getByText('Логи'));

    const inputSearch = screen.getByLabelText('Введите id пользователя');

    await userEvent.clear(inputSearch);
    await userEvent.keyboard('{Enter}');

    await checkCountElements('tr', 10);
  });
});
