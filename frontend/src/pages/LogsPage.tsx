import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import { useState, useRef, useMemo } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import Pagination from '../components/Pagination';
import { useAppSelector } from '../utilities/hooks';
import { selectors } from '../slices/logsSlice';
import type { Log } from '../types/Log';

const LogsPage = () => {
  const scrollRef = useRef<HTMLTableElement>(null);

  const { loadingStatus } = useAppSelector((state) => state.logs);
  const [searchId, setSearchId] = useState(0);

  const sortedLogs: Log[] = useAppSelector(selectors.selectAll).sort((a, b) => b.id - a.id);

  const logs = useMemo(
    () => (!searchId ? sortedLogs : sortedLogs.filter((log) => log.userId === searchId)),
    [searchId, loadingStatus],
  );

  const [showedData, setShowData] = useState<Log[]>(logs.slice(0, 10));

  const formik = useFormik<{ id: string | number | readonly string[] | undefined}>({
    initialValues: {
      id: '',
    },
    onSubmit: async ({ id }) => {
      try {
        if (!id) {
          setSearchId(0);
        } else {
          setSearchId(Number(id));
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

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
      <Pagination
        data={logs}
        showedData={showedData}
        setShowData={setShowData}
        rowsPerPage={10}
        scrollRef={scrollRef}
        loadingStatus={loadingStatus}
        searchId={searchId}
      />
    </div>
  );
};

export default LogsPage;
