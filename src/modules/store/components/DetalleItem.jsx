import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductByIdClient } from '../services/productsClient';
import useCart from '../hooks/useCart';

function DetalleItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getProductByIdClient(id);
        setProduct(data);
        setQty(1);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChangeQty = (delta) => {
    if (!product) return;
    const maxStock = product.stockQuantity ?? 0;
    if (maxStock <= 0) return;

    setQty((prev) => {
      let next = prev + delta;
      if (next < 1) next = 1;
      if (next > maxStock) next = maxStock;
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;

    const maxStock = product.stockQuantity ?? 0;
    if (maxStock <= 0) {
      alert('Este producto no tiene stock disponible.');
      return;
    }

    // cuánto ya hay en el carrito de este producto
    const existingItem = cart.find(
      (item) => (item.id ?? item.productId) === product.id
    );
    const currentInCart = existingItem ? existingItem.quantity : 0;
    const totalRequested = currentInCart + qty;

    if (totalRequested > maxStock) {
      const disponible = Math.max(maxStock - currentInCart, 0);
      alert(
        `No hay stock suficiente. Stock disponible adicional: ${disponible}`
      );
      return;
    }

    // uso el hook
    addCart(product, qty);
  };

  if (loading) return <p className="p-4 text-sm text-neutral-500">Cargando producto...</p>;
  if (error)   return <p className="p-4 text-sm text-red-500">{error}</p>;
  if (!product) return <p className="p-4 text-sm text-neutral-500">Producto no encontrado.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 my-7 py-7">
      <div className="flex-1">
        <div className="w-full aspect-[4/3] bg-neutral-100 rounded-lg mb-3" />
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <button
          type="button"
          className="text-xs text-purple-500 mb-2"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <h1 className="text-lg font-semibold">{product.name}</h1>

        <p className="text-xs text-neutral-500">
          SKU: <span className="font-mono">{product.sku}</span><br />
          Código interno: <span className="font-mono">{product.internalCode}</span>
        </p>

        <p className="text-sm text-neutral-700">
          {product.description || 'Sin descripción'}
        </p>

        <p className="text-xl font-bold mt-2">
          ${product.currentUnitPrice}
        </p>

        <p className="text-xs text-neutral-600">
          Stock disponible: {product.stockQuantity}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center border rounded-full"
              onClick={() => handleChangeQty(-1)}
            >
              -
            </button>
            <span className="text-sm w-8 text-center">{qty}</span>
            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center border rounded-full"
              onClick={() => handleChangeQty(1)}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="text-xs font-semibold px-4 py-2 rounded-full bg-purple-200 hover:bg-purple-300"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleItem;