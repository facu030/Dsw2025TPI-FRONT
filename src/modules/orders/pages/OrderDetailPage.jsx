// src/modules/orders/pages/OrderDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { getOrderById } from '../services/listServices';

const STATUS_LABELS = {
  Pending: 'Pendiente',
  Completed: 'Completada',
  Canceled: 'Cancelada',
};

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError('');

        const { data, error } = await getOrderById(id);

        if (error) {
          throw error;
        }

        setOrder(data);
      } catch (err) {
        console.error('Error al obtener orden', err);
        setError('No se pudo cargar la orden (puede que no exista).');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const formatCurrency = (value = 0) =>
    Number(value).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    });

  if (loading) {
    return (
      <Card>
        <p>Cargando orden...</p>
      </Card>
    );
  }

  if (error || !order) {
    return (
      <Card>
        <p className="text-red-500 mb-4">{error || 'Orden no encontrada.'}</p>
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </Card>
    );
  }

  const statusText = order.status
    ? STATUS_LABELS[order.status] ?? order.status
    : 'N/D';

  return (
    <div>
      <Card className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">
            Orden #{order.id?.slice(0, 8)}
          </h1>
          <Button onClick={() => navigate(-1)}>Volver</Button>
        </div>

        <p className="mb-1">
          <span className="font-semibold">Cliente:</span>{' '}
          {order.customerName ?? 'N/D'}
        </p>
        <p className="mb-1">
          <span className="font-semibold">Estado:</span> {statusText}
        </p>
        <p className="mb-1">
          <span className="font-semibold">Fecha:</span>{' '}
          {order.date ? new Date(order.date).toLocaleString() : 'N/D'}
        </p>
        <p className="mb-3">
          <span className="font-semibold">Total:</span>{' '}
          {formatCurrency(order.totalAmount)}
        </p>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-3">Ítems de la orden</h2>

        {order.orderItems && order.orderItems.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Producto</th>
                <th className="text-right py-1">Cantidad</th>
                <th className="text-right py-1">Precio</th>
                <th className="text-right py-1">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item.productId} className="border-b">
                  <td className="py-1">{item.productName}</td>
                  <td className="py-1 text-right">{item.quantity}</td>
                  <td className="py-1 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-1 text-right">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay productos en esta orden.</p>
        )}
      </Card>
    </div>
  );
}

export default OrderDetailPage;
