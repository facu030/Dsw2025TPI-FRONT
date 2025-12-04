import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useCart from '../hooks/useCart';
import useAuth from '../../auth/hook/useAuth';
import { instance } from '../../shared/api/axiosInstance'; 

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    cart,
    updateQuantity,
    removeCart,
    clearCart,
    total,
    totalItems,
  } = useCart();

  const [saving, setSaving] = useState(false); 

  const formatCurrency = (value) =>
    value.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    });

  const finalizarCompra = async () => {
    if (!cart.length || saving) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const orderRequest = {

      shippingAddress: 'Dirección de envío demo',
      billingAddress: 'Dirección de facturación demo',
      orderItems: cart.map((item) => ({
        productId: item.id ?? item.productId,
        quantity: item.quantity,
        unitPrice: item.currentUnitPrice ?? item.unitPrice ?? 0,
      })),
    };

    try {
      setSaving(true);

      const response = await instance.post('/api/orders/me', orderRequest);
      console.log('Orden creada:', response.data);

      clearCart();

      navigate('/');
    } catch (error) {
      console.error('Error al finalizar compra', error);
      alert('No se pudo completar la compra. Intentalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const botonBack = () => {
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={botonBack}
          className="text-xs text-purple-500 hover:underline"
        >
          ← Volver al catálogo
        </button>
        <h1 className="text-lg font-semibold">Carrito de compras</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 text-sm text-neutral-500">
              Tu carrito está vacío.
            </div>
          ) : (
            cart.map((item) => {
              const id = item.id ?? item.productId;
              const unitPrice = item.currentUnitPrice ?? item.unitPrice ?? 0;
              const subtotal = unitPrice * item.quantity;

              return (
                <div
                  key={id}
                  className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row justify-between gap-4"
                >
                  <div>
                    <p className="text-sm sm:text-md font-semibold">
                      {item.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Cantidad de productos: {item.quantity}
                      <br />
                      Sub Total:{' '}
                      <span className="font-medium">
                        {formatCurrency(subtotal)}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="flex items-center border rounded-full px-2 py-1 text-xs">
                      <button
                        type="button"
                        className="px-2"
                        onClick={() => updateQuantity(id, -1)}
                      >
                        −
                      </button>
                      <span className="px-2 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() => updateQuantity(id, 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeCart(id)}
                      className="text-xs px-3 py-1 rounded-full bg-purple-200 hover:bg-red-600"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <aside className="bg-white rounded-xl shadow-sm p-4 h-full flex flex-col">
          <h2 className="sm:text-xl text-sm font-semibold mb-3">
            Detalle de pedido
          </h2>

          <div className="text-xs text-neutral-600 space-y-1 mb-4 flex-1">
            <p>
              Cantidad de ítems en total:{' '}
              <span className="font-medium">{totalItems}</span>
            </p>
            <p>
              Total a pagar:{' '}
              <span className="font-semibold">
                {formatCurrency(total)}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={finalizarCompra}
            disabled={!cart.length || saving}
            className={`
              w-full text-xs font-semibold px-4 py-2 rounded-full 
              ${
                cart.length && !saving
                  ? 'bg-purple-200 hover:bg-purple-300'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
          >
            {saving ? 'Procesando...' : 'Finalizar Compra'}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
