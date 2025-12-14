import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProductsClient } from "../services/productsClient";

function ProductsGrid({ search = "" }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);    
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const { items, total: totalFromApi } = await getProductsClient({
          page,
          pageSize,      
          search,
          status: "enabled",
        });

        setProducts(items);
        setTotal(totalFromApi);
      } catch (err) {
        console.error("Error cargando productos", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, search, pageSize]);

  // Cambiar cantidad elegida por producto
  const cambiarCantidad = (product, delta) => {
    const maxStock = product.stockQuantity ?? 0;
    if (maxStock <= 0) return;

    setQuantities((prev) => {
      const current = prev[product.id] ?? 1;
      let next = current + delta;

      if (next < 1) next = 1;
      if (next > maxStock) next = maxStock;

      return { ...prev, [product.id]: next };
    });
  };

  // Agregar al carrito
  const agregarCarrito = (product) => {
    const maxStock = product.stockQuantity ?? 0;
    if (maxStock <= 0) {
      alert("Este producto no tiene stock disponible.");
      return;
    }

    const qty = quantities[product.id] ?? 1;

    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : [];

    const index = cart.findIndex((item) => item.productId === product.id);
    const currentInCart = index >= 0 ? cart[index].quantity : 0;
    const totalRequested = currentInCart + qty;

    if (totalRequested > maxStock) {
      alert(
        `No hay stock suficiente. Stock disponible: ${
          maxStock - currentInCart
        }`
      );
      return;
    }

    if (index >= 0) {
      cart[index].quantity = totalRequested;
    } else {
      cart.push({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        unitPrice: product.currentUnitPrice,
        quantity: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  if (loading && products.length === 0) {
    return <p className="text-sm text-neutral-500">Cargando productos...</p>;
  }

  if (!loading && products.length === 0 && !error) {
    return (
      <p className="text-sm text-neutral-500">
        No hay productos para mostrar.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 m-4 p-4">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const qty = quantities[product.id] ?? 1;
          const maxStock = product.stockQuantity ?? 0;

          return (
            <ProductCard
              key={product.id}
              product={product}
              qty={qty}
              maxStock={maxStock}
              onDecrease={() => cambiarCantidad(product, -1)} 
              onIncrease={() => cambiarCantidad(product, 1)}
              onAdd={() => agregarCarrito(product)}
            />
          );
        })}
      </div>

      {total > 0 && (
        <div className="flex flex-row items-center justify-center gap-3 mt-4">
          <button
            type="button"
            className="px-3 py-1 text-xs border rounded-full disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>

          <span className="text-xs text-neutral-600">
            Página {page} de {lastPage}
          </span>

          <button
            type="button"
            className="px-3 py-1 text-xs border rounded-full disabled:opacity-40"
            disabled={page === lastPage}
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
          >
            Siguiente
          </button>

          <select
            value={pageSize}
            onChange={(e) => {
              setPage(1);                    
              setPageSize(Number(e.target.value));
            }}
            className="ml-3 text-xs border rounded-full px-2 py-1"
          >
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default ProductsGrid;
