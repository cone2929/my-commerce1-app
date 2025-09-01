import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { logger } from './utils/로깅';

const root = ReactDOM.createRoot(document.getElementById('root'));

function renderApp() {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

renderApp();

// 🐥🐥🐥🐥🐥 HMR 지원 (개발 환경에서만)
if (import.meta.hot) {
  import.meta.hot.accept('./App', () => {
    logger.log('App 컴포넌트 업데이트됨');
    renderApp();
  });
}

// 🐥🐥🐥🐥🐥 성능 측정 함수는 필요에 따라 나중에 활용
reportWebVitals(logger.log);



