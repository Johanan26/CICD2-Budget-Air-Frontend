import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const appEl = document.getElementById('app');

if (appEl) {
  ReactDOM.createRoot(appEl).render(<App />);
}
