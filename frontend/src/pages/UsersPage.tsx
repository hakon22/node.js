import { Table, Spinner } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { useAppSelector } from '../utilities/hooks';
import type { PropsUsers, User } from '../types/User';

const UsersPage = ({ users }: PropsUsers) => {
  const navigate = useNavigate();

  const scrollRef = useRef<HTMLTableElement>(null);

  const { loadingStatus } = useAppSelector((state) => state.users);
  const sortedUsers: User[] = users.sort((a, b) => b.id - a.id);

  const [showedData, setShowData] = useState<User[]>(sortedUsers.slice(0, 10));

  return loadingStatus !== 'finish' ? (
    <div className="position-absolute top-50 left-50">
      <Spinner animation="border" variant="primary" role="status" />
    </div>
  ) : (
    <div className="col-12 my-4">
      <Helmet>
        <title>Пользователи</title>
        <meta name="description" content="Страница с пользователями" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Table striped bordered hover ref={scrollRef}>
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>Имя</th>
            <th>Почта</th>
            <th>Пароль</th>
            <th>Дата создания</th>
            <th>Дата обновления</th>
          </tr>
        </thead>
        <tbody>
          {showedData.sort((a, b) => b.id - a.id).map(({
            id, username, email, password, createdAt, updatedAt,
          }) => {
            const createdDate = new Date(createdAt).toLocaleDateString('ru-RU');
            const updatedDate = new Date(updatedAt).toLocaleDateString('ru-RU');
            return (
              <tr key={id} onClick={() => navigate(`/users/${id}`)} role="button">
                <td className="text-center">{id}</td>
                <td>{username}</td>
                <td>{email}</td>
                <td>{password}</td>
                <td className="text-center">{createdDate}</td>
                <td className="text-center">{updatedDate}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination
        data={sortedUsers}
        showedData={showedData}
        setShowData={setShowData}
        rowsPerPage={10}
        scrollRef={scrollRef}
        loadingStatus={loadingStatus}
      />
    </div>
  );
};

export default UsersPage;
