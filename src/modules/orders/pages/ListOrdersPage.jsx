import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';   // 👈 IMPORTANTE
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { listOrders } from '../services/listServices';

const STATUS_LABELS = {
  Pending: 'Pendiente',
  Completed: 'Completada',
  Canceled: 'Cancelada',
};

function ListOrdersPage() {
  const navigate = useNavigate();                // 👈 para ir al detalle

  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Fetching orders with (solo back):', {
        search,
        pageNumber,
        pageSize,
      });

      const { data, error: apiError } = await listOrders(
        search,
        statusFilter,
        pageNumber,
        pageSize
      );

      if (apiError) throw apiError;

      setOrders(data?.orderItems ?? []);
      setTotal(data?.total ?? 0);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError('No se pudieron cargar las órdenes. Revisa la consola para más detalles.');
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize]);

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSearch = async () => {
    if (pageNumber !== 1) {
      setPageNumber(1);
    }
    await fetchOrders();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChangePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPageNumber(newPage);
  };

  const handleChangePageSize = (newSize) => {
    const size = Number(newSize);
    if (!size) return;
    setPageSize(size);
    setPageNumber(1);
  };

  if (error) {
    return (
      <Card>
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={fetchOrders}>Reintentar</Button>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl">Órdenes</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 w-full">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Buscar por cliente o ID..."
              className="text-[1.3rem] w-full border p-2 rounded"
            />
            <Button
              className="h-11 w-11 flex justify-center items-center"
              onClick={handleSearch}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path
                  d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPageNumber(1);
            }}
            className="text-[1.3rem] w-full sm:w-auto border p-2 rounded"
          >
            <option value="all">Todos los estados</option>
            <option value="Pending">Pendiente</option>
            <option value="Completed">Completada</option>
            <option value="Canceled">Cancelada</option>
          </select>
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <div className="text-center p-4">Cargando órdenes...</div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <p className="text-center text-gray-500">
              No se encontraron órdenes con esos criterios.
            </p>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="flex items-center justify-between"
            >
              <div>
                <h1>
                  #{order.id.slice(0, 8)} - {order.customerName}
                </h1>
                <p className="text-base">
                  Estado: {STATUS_LABELS[order.status] ?? order.status}
                </p>
              </div>

              <Button
                className="px-4 py-2 rounded-full"
                onClick={() => navigate(`/admin/orders/${order.id}`)}  // 👈 botón Ver
              >
                Ver
              </Button>
            </Card>
          ))
        )}
      </div>

      {filteredOrders.length > 0 && (
        <div className="flex justify-center items-center mt-3 text-sm sm:text-base">
          <button
            disabled={pageNumber === 1}
            onClick={() => handleChangePage(pageNumber - 1)}
            className="bg-gray-200 disabled:bg-gray-100 px-3 py-1 rounded mx-1"
          >
            Atrás
          </button>

          <span className="mx-2 font-bold">
            {pageNumber} / {totalPages}
          </span>

          <button
            disabled={pageNumber === totalPages}
            onClick={() => handleChangePage(pageNumber + 1)}
            className="bg-gray-200 disabled:bg-gray-100 px-3 py-1 rounded mx-1"
          >
            Siguiente
          </button>

          <select
            value={pageSize}
            onChange={(e) => handleChangePageSize(e.target.value)}
            className="ml-3 border p-1 rounded"
          >
            <option value="2">2 por pág</option>
            <option value="10">10 por pág</option>
            <option value="15">15 por pág</option>
            <option value="20">20 por pág</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default ListOrdersPage;
