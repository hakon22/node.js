/* eslint-disable no-nested-ternary */
import { Helmet } from 'react-helmet';
import { useParams, Navigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { selectors } from '../slices/userSlice';
import routes from '../routes';
import { useAppSelector } from '../utilities/hooks';
import UpdateUser from '../components/UpdateUser';
import type { User } from '../types/User';

const UsersPage = () => {
  const { id } = useParams();

  const { loadingStatus } = useAppSelector((state) => state.users);
  const user: User | undefined = useAppSelector((state) => selectors.selectById(state, Number(id)));

  return user ? (
    <div className="col-12 col-md-8 mt-4">
      <Helmet>
        <title>
          Пользователь
          {' '}
          {user.username}
        </title>
        <meta name="description" content={`Информация пользователя ${user.username}`} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Card border="warning" bg="light" className="text-center mb-4 d-flex justify-content-center align-items-center">
        <Card.Header className="fs-4 col-12">{user.username}</Card.Header>
        <Card.Body className="col-12 col-xl-8 d-flex justify-content-center">
          <UpdateUser
            id={user.id}
            username={user.username}
            email={user.email}
            password={user.password}
          />
        </Card.Body>
      </Card>
    </div>
  ) : !user && loadingStatus === 'finish' ? (<Navigate to={routes.homePage} />) : null;
};

export default UsersPage;
