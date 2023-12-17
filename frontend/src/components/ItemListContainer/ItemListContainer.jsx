import { useState, useEffect } from "react";
import ItemList from "../ItemList/ItemList";
import { useParams } from "react-router-dom";
import './ItemListContainer.css';

const ItemListContainer = () => {
    const [productos, setProductos] = useState([]);
    const { idCategoria } = useParams();

    useEffect(() => {
        const apiUrl = idCategoria
            ? `http://localhost:8080/api/products?category=${idCategoria}`
            : 'http://localhost:8080/api/products';

        fetch(apiUrl) 
            .then(response => response.json())
            .then(data => setProductos(data))
            .catch(error => console.error('Error al obtener productos:', error));
    }, [idCategoria]);

    return (
        <>
            <div className="divTitle">
                <img className="logoSabroso" src="../img/logo.png" alt="logo sabroson" />
            </div>
            <ItemList productos={productos} />
        </>
    );
}

export default ItemListContainer;
