import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product, qty, maxStock, onDecrease, onIncrease, onAdd }) {
    const navigate = useNavigate();
  
    const goToDetail = () => {
      navigate(`/product/${product.id}`);
    };

  const outOfStock = (maxStock ?? 0) <= 0;

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm p-4">
      <button
        type="button"
        onClick={goToDetail}
        className="aspect-[4/3] bg-neutral-100 rounded-lg mb-3 w-full"
      >
        {/* acá podrías poner <img /> si después tenés URL */}
      </button>

      <h3 className="font-semibold text-sm mb-1 line-clamp-1">
        {product.name}
      </h3>

      <p className="text-xs text-neutral-500 mb-2 line-clamp-2">
        {product.description || 'Sin descripción'}
      </p>

      <span className="font-bold text-sm mb-1">
        ${product.currentUnitPrice}
      </span>

      <span className="text-[11px] text-neutral-500 mb-3">
        Stock: {maxStock}
      </span>

      <div className="mt-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-6 h-6 flex items-center justify-center border rounded-full"
            onClick={onDecrease}
            disabled={outOfStock || qty <= 1}
          >
            -
          </button>
          <span className="text-sm w-6 text-center">{qty}</span>
          <button
            type="button"
            className="w-6 h-6 flex items-center justify-center border rounded-full"
            onClick={onIncrease}
            disabled={outOfStock || qty >= maxStock}
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={onAdd}
          disabled={outOfStock}
          className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-200 hover:bg-purple-300 disabled:opacity-40"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}

export default ProductCard;