import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './modules/auth/context/AuthProvider';

import LoginPage from './modules/auth/pages/LoginPage';
import RegisterModal from './modules/auth/components/RegisterModal';

import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import Dashboard from './modules/templates/components/Dashboard';

import Home from './modules/home/pages/Home';
import ListProductsPage from './modules/products/pages/ListProductsPage';
import CreateProductPage from './modules/products/pages/CreateProductPage';

import ListOrdersPage from './modules/orders/pages/ListOrdersPage';
import OrderDetailPage from './modules/orders/pages/OrderDetailPage';

import StoreLayout from './modules/store/components/StoreLayout.jsx';
import DetalleItem from './modules/store/components/DetalleItem';
import StorePage from './modules/store/pages/StorePage';
import CartPage from './modules/store/pages/CartPage';

function App() {
  const router = createBrowserRouter([
    // ================== TIENDA ==================
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
      ],
    },

    // ================== AUTH ==================
    {
      path: '/login',
      element: <LoginPage />,
      children: [
        {
          path: 'register',      // /login/register
          element: <RegisterModal />,
        },
      ],
    },

    // ================== ADMIN ==================
    {
      path: '/admin',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'home',          // /admin/home
          element: <Home />,
        },
        {
          path: 'products',      // /admin/products
          element: <ListProductsPage />,
        },
        {
          path: 'products/create', // /admin/products/create
          element: <CreateProductPage />,
        },
        {
          path: 'orders',        // /admin/orders  (listado)
          element: <ListOrdersPage />,
        },
        {
          path: 'orders/:id',    // /admin/orders/:id  (detalle)
          element: <OrderDetailPage />,
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
