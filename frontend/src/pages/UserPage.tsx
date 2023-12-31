/* eslint-disable no-nested-ternary */
import { useParams, Navigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { selectors } from '../slices/userSlice';
import routes from '../routes';
import { useAppSelector } from '../utilities/hooks';
import UpdateUser from '../components/UpdateUser';
import Helmet from '../components/Helmet';
import type { User } from '../types/User';

const UserPage = () => {
  const { id } = useParams();

  const { loadingStatus } = useAppSelector((state) => state.users);
  const user: User | undefined = useAppSelector((state) => selectors.selectById(state, Number(id)));

  return user ? (
    <div className="col-12 col-md-8 mt-4">
      <Helmet title={`Пользователь ${user.username}`} description={`Информация пользователя ${user.username}`} />
      <Card border="warning" bg="light" className="text-center mb-4 d-flex justify-content-center align-items-center">
        <Card.Header className="fs-4 col-12">{user.username}</Card.Header>
        <Card.Body className="col-12 col-xl-8 d-flex justify-content-center">
          <UpdateUser
            user={user}
          />
        </Card.Body>
      </Card>
    </div>
  ) : !user && loadingStatus === 'finish' ? (<Navigate to={routes.usersPage} />) : null;
};

export default UserPage;
