import { Helmet } from 'react-helmet';
import { useEffect, useState, useRef } from 'react';
import { Table, Spinner, Pagination } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '../utilities/hooks';
import { fetchLogs, selectors } from '../slices/logsSlice';
import type { Log } from '../types/Log';

const LogsPage = () => {
  const dispatch = useAppDispatch();

  const scrollRef = useRef<HTMLTableElement>(null);

  const { loadingStatus } = useAppSelector((state) => state.logs);
  const logs: Log[] = useAppSelector(selectors.selectAll).sort((a, b) => b.id - a.id);

  const rowsPerPage: number = 10;
  const startRows = logs.slice(0, rowsPerPage);
  const lastPage = Math.ceil(logs.length / rowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [showedData, setShowData] = useState(startRows);

  const handleClick = (page: number) => {
    setCurrentPage(page);
    const pageIndex = page - 1;
    const firstIndex = pageIndex * rowsPerPage;
    const lastIndex = pageIndex * rowsPerPage + rowsPerPage;
    setShowData(logs.slice(firstIndex, lastIndex));
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
    dispatch(fetchLogs());
  }, [dispatch]);

  useEffect(() => {
    if (loadingStatus === 'finish' && !showedData.length) {
      setShowData(startRows);
    }
  }, [loadingStatus, showedData.length, startRows]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [currentPage]);

  return loadingStatus !== 'finish' ? (
    <div className="position-absolute top-50 left-50">
      <Spinner animation="border" variant="primary" role="status" />
    </div>
  ) : (
    <div className="col-12 my-4">
      <Helmet>
        <title>Логи</title>
        <meta name="description" content="Страница с логами" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Table striped bordered hover ref={scrollRef}>
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>id</th>
            <th className="col-8">Сообщение</th>
            <th className="col-3">Дата создания</th>
          </tr>
        </thead>
        <tbody>
          {showedData.map(({
            id, userId, message, createdAt,
          }) => {
            const createdDateTime = new Date(createdAt).toLocaleString('ru-RU');
            return (
              <tr key={id}>
                <td className="text-center">{id}</td>
                <td className="text-center">{userId}</td>
                <td>{message}</td>
                <td className="text-center">{createdDateTime}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Pagination className="d-flex justify-content-center align-items-center">{items}</Pagination>
    </div>
  );
};

export default LogsPage;
