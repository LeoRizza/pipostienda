import './ItemList.css';
import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link desde react-router-dom

const ItemList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/products');
                const data = await response.json();
                setProducts(Array.isArray(data.docs) ? data.docs : []);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className='contenedorProductos'>
            {loading ? (
                <p>Cargando productos...</p>
            ) : Array.isArray(products) && products.length > 0 ? (
                products.map(product => (
                    <div key={product._id}>
                        <Card className='cardLoca'>
                            <Card.Img variant="top" className='detalleImg' src={product.img} />
                            <Card.Body style={{ position: "relative" }}>
                                <div className='dataCard'>
                                    <p>stock: {product.stock} </p>
                                </div>
                                <Card.Title style={{ fontWeight: "900" }}>{product.title}</Card.Title>
                                <Card.Text>
                                    <br />
                                    {product.description}
                                    <br />
                                    <strong>price: $ {product.price}</strong>
                                </Card.Text>
                                <Link className='botonDetalle' to={`/item/${product._id}`} >detalle</Link>
                                <p>codigo: {product._id}</p>
                            </Card.Body>
                        </Card>
                    </div>
                ))
            ) : (
                <p>No se encontraron productos.</p>
            )}
        </div>
    );
}

export default ItemList;
