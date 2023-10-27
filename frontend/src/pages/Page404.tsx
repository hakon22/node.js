import { Card } from 'react-bootstrap';
import Helmet from '../components/Helmet';

const Page404 = () => (
  <div className="col-12 col-md-8 mt-4">
    <Helmet title="Ошибка 404" description="Страница не найдена" />
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

export default Page404;
