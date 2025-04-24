import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './layouts/Home';
import AddUser from './layouts/AddUser';
import useAuthStore from './store/auth-store';
import Login from './layouts/Login';
import { useEffect } from 'react';

const App = () => {
  const { isAuthenticated, login } = useAuthStore();
  const token = sessionStorage.getItem('token');
  useEffect(() => {
 
    if (token) {
      if (token) {
        login(null);
      }
    }
  }, [token]);


  if (!isAuthenticated) {
    return <Login />;
  }
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/new'
          element={<AddUser />}
        />
      </Routes>
    </Router>
  );
};

export default App;
