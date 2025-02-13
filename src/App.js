import logo from './logo.svg';
import './App.css';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Edit from './components/Edit';

const Routes = () => {
  const routes = useRoutes([
    { path: '/', element: <Login /> },
    {path:"/dashboard", element: <Dashboard />},
    {path:"/edit", element: <Edit />}
  ])
  return routes
}
function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

export default App;