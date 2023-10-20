import { Table, Spinner, Pagination } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../utilities/hooks';
import type { PropsUsers, User } from '../types/User';

const UsersPage = ({ users }: PropsUsers) => {
  const navigate = useNavigate();

  const scrollRef = useRef<HTMLTableElement>(null);

  const { loadingStatus } = useAppSelector((state) => state.users);
  const sortedUsers: User[] = users.sort((a, b) => b.id - a.id);

  const [urlParams] = useSearchParams();
  const urlPage = Number(urlParams.get('page'));

  const rowsPerPage: number = 10;
  const lastPage = Math.ceil(sortedUsers.length / rowsPerPage);

  const paramsCheck = (value: number) => (value <= lastPage && value > 0 ? value : 1);

  const pageParams: number = paramsCheck(urlPage);
  const startRows = sortedUsers.slice(pageParams - 1, rowsPerPage);
  const [currentPage, setCurrentPage] = useState(pageParams);
  const [showedData, setShowData] = useState(startRows);

  const handleClick = (page: number) => {
    setCurrentPage(page);
    const pageIndex = page - 1;
    const firstIndex = pageIndex * rowsPerPage;
    const lastIndex = pageIndex * rowsPerPage + rowsPerPage;
    setShowData(sortedUsers.slice(firstIndex, lastIndex));
    navigate(`?page=${page}`);
  };

  const items: JSX.Element[] = [];

  for (let number = 1; number <= lastPage; number += 1) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handleClick(number)}
      >
        {number}
      </Pagination.Item>,
    );
  }

  useEffect(() => {
    if (loadingStatus === 'finish' && !showedData.length) {
      if ((paramsCheck(pageParams) === 1 && urlPage !== 1) || !urlPage) {
        navigate('?page=1');
      }
      handleClick(pageParams);
    }
  }, [loadingStatus]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [currentPage]);

  return loadingStatus !== 'finish' ? (
    <div className="text-center">
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
      <Pagination className="d-flex justify-content-center align-items-center">{items}</Pagination>
    </div>
  );
};

export default UsersPage;
