import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 레이아웃 from './components/레이아웃';
import 상품관리 from './pages/상품관리';
import 주문관리 from './pages/주문관리';
import UpdateNotification from './components/UpdateNotification';

function App() {
  return (
    <>
      <UpdateNotification />
      <Router>
        <Routes>
          <Route path="/" element={<레이아웃 />}>
            <Route index element={<Navigate to="/상품-관리" replace />} />
            <Route path="상품-관리" element={<상품관리 />} />
            <Route path="주문-관리" element={<주문관리 />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
