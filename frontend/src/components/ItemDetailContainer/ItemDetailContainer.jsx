import { useState, useEffect } from "react";
import ItemDetail from "../ItemDetail/ItemDetail";
import { useParams } from "react-router-dom";

const ItemDetailContainer = () => {
    const [producto, setProducto] = useState(null);
    const { idItem } = useParams();

    useEffect(() => {
        const apiUrl = `http://localhost:8080/api/products/${idItem}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => setProducto(data))
            .catch(error => console.error('Error al obtener el producto:', error));
    }, [idItem]);

    return (
        <div>
            {producto ? <ItemDetail {...producto} /> : <p>Cargando...</p>}
        </div>
    );
}

export default ItemDetailContainer;
