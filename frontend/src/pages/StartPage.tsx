import { Card } from 'react-bootstrap';
import CreateUser from '../components/CreateUser';
import Helmet from '../components/Helmet';

const StartPage = () => (
  <div className="col-12 col-md-8 my-4">
    <Helmet title="Главная" description="Главная страница" />
    <Card border="warning" bg="light" className="text-center mb-5 d-flex justify-content-center align-items-center">
      <Card.Header className="fs-4 col-12">Добавление пользователя</Card.Header>
      <Card.Body className="col-12 col-xl-8 d-flex justify-content-center">
        <CreateUser />
      </Card.Body>
    </Card>
  </div>
);

export default StartPage;
