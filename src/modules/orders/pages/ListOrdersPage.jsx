import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { listOrders } from '../services/listServices';

const STATUS_LABELS = {
  Pending: 'Pendiente',
  Completed: 'Completada',
  Cancelled: 'Cancelada',
};

function ListOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchOrders = async ({
    status = statusFilter,
    searchText = search,
    pageNumber: pageParam = pageNumber,
    pageSize: sizeParam = pageSize,
  } = {}) => {
    try {
      setLoading(true);

      const { data, error } = await listOrders({
        status,
        search: searchText,
        pageNumber: pageParam,
        pageSize: sizeParam,
      });

      if (error) throw error;

      setOrders(data?.orderItems ?? []);
      setTotal(data?.total ?? 0);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las órdenes');
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, pageNumber, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSearch = async () => {
    setPageNumber(1);
    await fetchOrders({ searchText: search, pageNumber: 1 });
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
    return <Card>{error}</Card>;
  }

  return (
    <div>
      {/* CARD SUPERIOR: título + buscador + filtro (mismo layout que productos) */}
      <Card>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl">Órdenes</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 w-full">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Buscar"
              className="text-[1.3rem] w-full"
            />
            <Button className="h-11 w-11" onClick={handleSearch}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
            className="text-[1.3rem] w-full sm:w-auto"
          >
            <option value="all">Estado de Orden</option>
            <option value="Pending">Pendiente</option>
            {/* cuando tengas más estados, los agregás acá */}
          </select>
        </div>
      </Card>

      {/* LISTA: cada orden en su propio Card, igual que productos */}
      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <span>Buscando datos...</span>
        ) : orders.length === 0 ? (
          <span className="text-sm text-gray-500">
            No se encontraron órdenes.
          </span>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <h1>
                #{order.id.slice(0, 8)} - {order.customerName}
              </h1>
              <p className="text-base">
                Estado:{' '}
                {STATUS_LABELS[order.status] ?? order.status}
              </p>
            </Card>
          ))
        )}
      </div>

      {/* PAGINACIÓN: misma estructura que en productos */}
      <div className="flex justify-center items-center mt-3 text-sm sm:text-base">
        <button
          disabled={pageNumber === 1}
          onClick={() => handleChangePage(pageNumber - 1)}
          className="bg-gray-200 disabled:bg-gray-100 px-2 py-1"
        >
          Atras
        </button>

        <span className="mx-2">
          {pageNumber} / {totalPages}
        </span>

        <button
          disabled={pageNumber === totalPages}
          onClick={() => handleChangePage(pageNumber + 1)}
          className="bg-gray-200 disabled:bg-gray-100 px-2 py-1"
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={(e) => handleChangePageSize(e.target.value)}
          className="ml-3"
        >
          <option value="2">2</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default ListOrdersPage;
