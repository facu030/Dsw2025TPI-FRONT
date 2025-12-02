import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import { listOrders } from '../services/listServices';

function ListOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await listOrders();

      if (error) throw error;

      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // filtro por texto + estado
  const filteredOrders = orders.filter((order) => {
    const text = search.toLowerCase().trim();

    const matchesSearch =
      text === '' ||
      order.id.toLowerCase().includes(text) ||
      order.customerId.toLowerCase().includes(text) ||
      order.orderItems.some((item) =>
        item.productName.toLowerCase().includes(text)
      );

    // por ahora todas las órdenes son "pendiente"
    const orderStatus = 'pendiente';

    const matchesStatus =
      statusFilter === 'all' || statusFilter === orderStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <Card>Cargando órdenes...</Card>;
  }

  if (error) {
    return <Card>{error}</Card>;
  }

  return (
    <Card>
      <h1 className="text-3xl mb-4">Órdenes</h1>

      {/* Buscador + filtro de estado */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar"
          className="flex-1 border rounded px-3 py-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          type="button"
          className="px-4 rounded bg-purple-500 text-white hover:bg-purple-600 transition"
        >
          <span className="material-symbols-outlined">search</span>
        </button>

        <select
          className="border rounded px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Estado de Orden</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>

      {/* Listado de órdenes */}
      <div className="flex flex-col gap-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="flex justify-between items-center border rounded-xl px-4 py-3 bg-white shadow-sm"
          >
            <div>
              {/* Línea principal: # - Nombre de Cliente (texto fijo por ahora) */}
              <div className="font-semibold text-sm">
                #{order.id.slice(0, 8)} - Nombre de Cliente
              </div>

              {/* Segunda línea: Estado */}
              <div className="text-xs text-gray-500 mt-1">
                Estado: <span className="font-medium">Pendiente</span>
              </div>
            </div>

            <button
              type="button"
              className="px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold"
              onClick={() => {
                console.log('Ver orden', order.id);
              }}
            >
              Ver
            </button>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-sm text-gray-500">
            No se encontraron órdenes.
          </div>
        )}
      </div>
    </Card>
  );
}

export default ListOrdersPage;
