import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import LoginPage from './modules/auth/pages/LoginPage';
import Dashboard from './modules/templates/components/Dashboard';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import Home from './modules/home/pages/Home';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';
import RegisterModal from './modules/auth/components/RegisterModal';

import StoreLayout from "./modules/store/components/StoreLayout.jsx";
import DetalleItem from "./modules/store/components/DetalleItem";
import StorePage from "./modules/store/pages/StorePage";
import CartPage from "./modules/store/pages/CartPage";


function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <StoreLayout />,
      children: [
        {
          index: true,              
          element: <StorePage />,
        },
        {
          path: 'product/:id',      
          element: <DetalleItem />,
        },
        {
          path: 'cart',
          element: <CartPage />,
        },
        {
          path: '/',
          element: <RegisterModal />,
        },
      ],
    },
    {
      path: '/login',
      element: <LoginPage />,
      children: [
        {
          path: 'register',
          element: <RegisterModal />,
        }
      ],
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/admin/home',
          element: <Home />,
        },
        {
          path: '/admin/products',
          element: <ListProductsPage />,
        },
        {
          path: '/admin/products/create',
          element: <CreateProductPage />,
        },
        {
          path: '/admin/orders',
          element: <ListOrdersPage />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
