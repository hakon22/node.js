import { Helmet } from 'react-helmet';
import { Card } from 'react-bootstrap';

const LogsPage = () => (
  <div className="col-12 col-md-8 mt-4">
    <Helmet>
      <title>Логи</title>
      <meta name="description" content="Страница с логами" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
    <Card border="warning" bg="light" className="text-center">
      <Card.Header>Ошибка 404</Card.Header>
      <Card.Body>
        <Card.Title>Страница не найдена</Card.Title>
        <Card.Text>
          Возможно, наши горе-разработчики что-то сломали :(
        </Card.Text>
      </Card.Body>
    </Card>
  </div>
);

export default LogsPage;
