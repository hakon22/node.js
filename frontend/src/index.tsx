import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import './scss/app.scss';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <>
    <ToastContainer />
    <App />
  </>,
);
