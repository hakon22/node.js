import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch } from '../utilities/hooks';
import { fetchUsers } from '../slices/userSlice';
import StartPage from '../pages/StartPage';
import UsersPage from '../pages/UsersPage';
import LogsPage from '../pages/LogsPage';
import Page404 from '../pages/Page404';
import routes from '../routes';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="container d-flex justify-content-center align-items-center flex-column">
      <BrowserRouter basename="/">
        <Routes>
          <Route path={routes.homePage} element={<StartPage />} />
          <Route path={routes.usersPage} element={<UsersPage />} />
          <Route path={routes.logsPage} element={<LogsPage />} />
          <Route path={routes.notFoundPage} element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
