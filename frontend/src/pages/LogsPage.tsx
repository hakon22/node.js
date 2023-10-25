import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import {
  useEffect, useState, useRef, useMemo,
} from 'react';
import { Table, Spinner, Pagination } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../utilities/hooks';
import { selectors } from '../slices/logsSlice';
import type { Log } from '../types/Log';

const LogsPage = () => {
  const navigate = useNavigate();

  const scrollRef = useRef<HTMLTableElement>(null);

  const { loadingStatus } = useAppSelector((state) => state.logs);
  const [numerId, setNumerId] = useState(0);

  const startLogs: Log[] = useAppSelector(selectors.selectAll).sort((a, b) => b.id - a.id);

  const logs = useMemo(
    () => (numerId === 0 || numerId === -1
      ? startLogs
      : startLogs.filter((log) => log.userId === numerId)),
    [numerId, loadingStatus],
  );

  const [urlParams] = useSearchParams();
  const urlPage = Number(urlParams.get('page'));

  const rowsPerPage: number = 10;
  const lastPage = Math.ceil(logs.length / rowsPerPage);

  const paramsCheck = (value: number) => (value <= lastPage && value > 0 ? value : 1);

  const pageParams: number = paramsCheck(urlPage);
  const startRows = logs.slice(pageParams - 1, rowsPerPage);
  const [currentPage, setCurrentPage] = useState(pageParams);
  const [showedData, setShowData] = useState(startRows);

  const handleClick = (page: number) => {
    setCurrentPage(page);
    const pageIndex = page - 1;
    const firstIndex = pageIndex * rowsPerPage;
    const lastIndex = pageIndex * rowsPerPage + rowsPerPage;
    setShowData(logs.slice(firstIndex, lastIndex));
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

  const formik = useFormik<{ id: string | number | readonly string[] | undefined}>({
    initialValues: {
      id: '',
    },
    onSubmit: async ({ id }) => {
      try {
        if (!id) {
          setNumerId(-1);
        } else {
          setNumerId(Number(id));
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  useEffect(() => {
    if (numerId) {
      handleClick(1);
    }
  }, [numerId]);

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
            <th>
              <form onSubmit={formik.handleSubmit}>
                <label htmlFor="id" className="hidden">Введите id пользователя</label>
                <input
                  type="search"
                  className="w-100 px-2 placeholder-center"
                  placeholder="id"
                  id="id"
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldValue('id', e.target.value.replace(/[^\d]/g, ''));
                  }}
                  value={formik.values.id}
                />
              </form>
            </th>
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
              <tr key={id} data-testid="tr">
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
