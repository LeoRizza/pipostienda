import { useState, createContext } from "react";

export const ContextCart = createContext({
    carrito: [],
    total: 0,
    cantidad: 0
})

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [cantidadTotal, setCantidadTotal] = useState(0);

    const agregarProducto = (item, cantidad) => {
        const productoExistente = cart.find(prod => prod.item.id === item.id);

        if (!productoExistente) {
            setCart(prev => [...prev, { item, cantidad }]);
            setCantidadTotal(prev => prev + cantidad);
            setTotal(prev => prev + (item.precio * cantidad));
        } else {
            const newCart = cart.map(prod => {
                if (prod.item.id === item.id) {
                    return { ...prod, cantidad: prod.cantidad + cantidad };
                } else {
                    return prod;
                }
            });
            setCart(newCart)
            setCantidadTotal(prev => prev + cantidad);
            setTotal(prev => prev + (item.precio * cantidad));
        }
    }

    const eliminarProducto = (id) => {
        const itemEliminado = cart.find(prod => prod.item.id === id);
        const newCart = cart.filter(prod => prod.item.id !== id);

        setCart(newCart);
        if (itemEliminado) {
            setCantidadTotal((prev) => prev - itemEliminado.cantidad);
            setTotal((prev) => prev - itemEliminado.item.precio * itemEliminado.cantidad);
        }
    }

    const vaciarCart = () => {
        setCart([]);
        setCantidadTotal(0);
        setTotal(0);
    }

    return (
        <ContextCart.Provider value={{ cart, agregarProducto, eliminarProducto, vaciarCart, total, cantidadTotal }}>
            {children}
        </ContextCart.Provider>
    )
}