import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Spinner, Table, Card } from 'react-bootstrap';
import { useAppSelector } from '../utilities/hooks';
import { selectors } from '../slices/userSlice';
import CreateUser from '../components/CreateUser';
import type { User } from '../types/User';

const StartPage = () => {
  const navigate = useNavigate();

  const { loadingStatus } = useAppSelector((state) => state.users);
  const users: User[] = useAppSelector(selectors.selectAll);

  return (
    <div className="col-12 col-md-8 mt-4">
      <Helmet>
        <title>Главная</title>
        <meta name="description" content="Главная страница" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Card border="warning" bg="light" className="text-center mb-5 d-flex justify-content-center align-items-center">
        <Card.Header className="fs-4 col-12">Главная страница</Card.Header>
        <Card.Body className="col-12 col-xl-8 d-flex justify-content-center">
          <CreateUser />
        </Card.Body>
      </Card>
      {loadingStatus !== 'finish' && (
        <div className="position-absolute bottom-50 end-50">
          <Spinner animation="border" variant="primary" role="status" />
        </div>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Имя</th>
            <th>Почта</th>
            <th>Пароль</th>
            <th>Дата создания</th>
            <th>Дата обновления</th>
          </tr>
        </thead>
        <tbody>
          {users.sort((a, b) => b.id - a.id).map(({
            id, username, email, password, createdAt, updatedAt,
          }) => {
            const createdDate = new Date(createdAt).toLocaleDateString('ru-RU');
            const updatedDate = new Date(updatedAt).toLocaleDateString('ru-RU');
            return (
              <tr key={id} onClick={() => navigate(`/users/${id}`)} role="button">
                <td>{id}</td>
                <td>{username}</td>
                <td>{email}</td>
                <td>{password}</td>
                <td>{createdDate}</td>
                <td>{updatedDate}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default StartPage;
