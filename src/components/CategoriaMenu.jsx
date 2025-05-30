import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { NumericFormat } from 'react-number-format';
import API from '../config/Api';

export default function CategoriaMenu() {

    const token = localStorage.getItem('token');
    const rol = token ? JSON.parse(atob(token.split(".")[1])).rol : 0;
    const location = useLocation();

    const pathParts = location.pathname.split("/").filter(Boolean);
    const categoriaId = pathParts[pathParts.length - 1]

    const [productos, setProductos] = useState([]);
    const [isDataUpdated, setIsDataUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [categoria, setCategoria] = useState(null);

    function rutaCategoria(rol, idProducto) {
        switch (rol) {
            case 3:
                return `/cliente/producto/${idProducto}`
            case 2:
                return `/empleado/producto/${idProducto}`
            default:
                return `/producto/${idProducto}`
        }
    }

    function renderIsLoading(cant) {
        const loadingItems = [];
        for (let i = 0; i < cant; i++) {
            loadingItems.push(
                <div className="placeholder-glow">
                    <div key={i} className="col rounded-5">
                        <div className="card text-center rounded-5 border-0 containerzoom animationhover">
                            <div className="divimagen w-100 pb-2">
                                <div loading='lazy' height={300} width={'100%'} className="rounded-top-5" alt="..." style={{ objectFit: 'cover' }} >
                                    <span className="placeholder col-12" style={{ height: '300px' }}></span>
                                </div>
                            </div>
                            <div className="card-body text-white rounded-bottom-5 animationtext">
                                <h5 className="homero">
                                    <span className="placeholder col-6"></span>
                                </h5>
                                <button className='btn btn-warning text-dark fw-bold rounded-pill placeholder' style={{ width: '30%' }}>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return loadingItems;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [productosRes, categoriaRes] = await Promise.all([
                    API.get(`${BACKEND_URL}/api/tienda/productos/categoria/${categoriaId}`),
                    API.get(`${BACKEND_URL}/api/tienda/categorias/${categoriaId}`),
                ]);
                setProductos(productosRes.data);
                setCategoria(categoriaRes.data);

            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
            setIsDataUpdated(false);
        };
        fetchData();
    }, [isDataUpdated, categoriaId]);

    return (
        <div className="container position-relative justify-content-between">
            <div className="d-flex justify-content-between mb-4">
                <h1>{categoria?.cat_nom ? categoria.cat_nom : 'Cargando...'}</h1>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-5">
                {isLoading && renderIsLoading(6)}
                {productos.map((producto) => (
                    <div key={producto.id_producto} className="col rounded-5">
                        <Link to={rutaCategoria(rol, producto.id_producto)} className='text-decoration-none'>
                            <div className="card text-center rounded-5 border-0 containerzoom animationhover">
                                <div className="divimagen w-100 pb-2">
                                    <img loading='lazy' src={`${producto.pro_foto}`} height={300} width={'100%'} className="rounded-top-5" alt="..." style={{ objectFit: 'cover' }} />
                                </div>
                                <div className="card-body text-white rounded-bottom-5 animationtext">
                                    {producto.pro_nom.length > 20 ? (
                                        <h5 className="homero">{producto.pro_nom.substring(0, 20) + '...'}</h5>
                                    ) : (
                                        <h5 className="homero">{producto.pro_nom}</h5>
                                    )}
                                    <p className="card-text">{producto.pro_desp}</p>
                                    <NumericFormat className='homero' value={producto.pro_precio} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'$ '} />
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <Link to={`/menu`} className={`btn btn-warning position-absolute top-0 end-0 mx-5 my-4 ${isLoading ? 'd-none' : ''}`}>Volver <i className="bi bi-arrow-left"></i></Link>

        </div >
    )
}
