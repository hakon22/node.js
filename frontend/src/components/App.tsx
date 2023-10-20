import {
  BrowserRouter, Routes, Route, NavLink,
} from 'react-router-dom';
import cn from 'classnames';
import { Navbar, Container } from 'react-bootstrap';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../utilities/hooks';
import { fetchUsers, selectors } from '../slices/userSlice';
import { fetchLogs } from '../slices/logsSlice';
import StartPage from '../pages/StartPage';
import UsersPage from '../pages/UsersPage';
import UserPage from '../pages/UserPage';
import LogsPage from '../pages/LogsPage';
import Page404 from '../pages/Page404';
import routes from '../routes';
import type { User } from '../types/User';

const App = () => {
  const dispatch = useAppDispatch();
  const isMobile = window.screen.width < 768;

  const users: User[] = useAppSelector(selectors.selectAll);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchLogs());
  }, [dispatch]);

  return (
    <BrowserRouter basename="/node.js">
      <Navbar className="bg-body-tertiary">
        <Container className={cn('justify-content-center', {
          'gap-5': !isMobile,
          'gap-3': isMobile,
        })}
        >
          <NavLink to={routes.homePage} className="btn btn-outline-primary">Главная</NavLink>
          <NavLink to={routes.usersPage} className="btn btn-outline-primary">Пользователи</NavLink>
          <NavLink to={routes.logsPage} className="btn btn-outline-primary">Логи</NavLink>
        </Container>
      </Navbar>
      <Container className="d-flex justify-content-center align-items-center flex-column">
        <Routes>
          <Route path={routes.homePage} element={<StartPage />} />
          <Route path={routes.usersPage}>
            <Route index element={<UsersPage users={users} />} />
            <Route path={routes.userPage} element={<UserPage />} />
          </Route>
          <Route path={routes.logsPage} element={<LogsPage />} />
          <Route path={routes.notFoundPage} element={<Page404 />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
