import { useState, useEffect } from 'react';

const useCart = () => {
  // inicializa estado leyendo del local 
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // sincronizar con local cada vez que cambie el estado del carro
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // para obtener el id de un item
  const getItemId = (itemOrProduct) =>
    itemOrProduct.id ?? itemOrProduct.productId;

  // para obtener el precio unitario de un producto
  const getUnitPrice = (itemOrProduct) =>
    itemOrProduct.currentUnitPrice ?? itemOrProduct.unitPrice ?? 0;

  // agregar producto
  const addCart = (product, quantity = 1) => {
    if (quantity === 0) return;

    const productId = getItemId(product);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => getItemId(item) === productId
      );

      // si ya existe, actualizamos cantidad
      if (existingIndex >= 0) {
        return prevCart.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                quantity: Math.max(1, item.quantity + quantity),
              }
            : item
        );
      }

      const newItem = {
        id: productId,
        sku: product.sku,
        name: product.name,
        currentUnitPrice: getUnitPrice(product),
        quantity: Math.max(1, quantity),
      };

      return [...prevCart, newItem];
    });
  };

  // actualizar cantidad
  const updateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          const id = getItemId(item);
          if (id !== productId) return item;

          const newQty = item.quantity + delta;
          
          if (newQty <= 0) return null;

          return { ...item, quantity: newQty };
        })
        .filter(Boolean)
    );
  };

  // borrar un producto por su ID ( al ser el objeto un tipo de dato inmutable osea solo puede ser modificado por la funcion set, utilizamos filter q es una funcion que 
  // crea un nuevo array con los elementos que cumplan la condicion dada), no podemos usar tipos de datos mutables como pop y splice)

  const removeCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => getItemId(item) !== productId));
  };

  // limpiar todo el carrito
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // totales
  const total = cart.reduce(
    (acc, item) => acc + getUnitPrice(item) * item.quantity,
    0
  );

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cart,
    addCart,
    updateQuantity,
    removeCart,
    clearCart,
    total,
    totalItems,
  };
};

export default useCart;