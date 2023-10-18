import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import './scss/app.scss';
import store from '../src/slices/index';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <ToastContainer />
    <App />
  </Provider>,
);
