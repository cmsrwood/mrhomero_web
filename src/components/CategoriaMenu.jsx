import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { NumericFormat } from 'react-number-format';
import Swal from 'sweetalert2';
import axios from 'axios';
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4400";

export default function CategoriaMenu() {

    const token = localStorage.getItem('token');
    const rol = token ? JSON.parse(atob(token.split(".")[1])).rol : 0;

    const location = useLocation();
    const categoriaId = token ? location.pathname.split("/")[3] : location.pathname.split("/")[2];

    const [productos, setProductos] = useState([]);
    const [isDataUpdated, setIsDataUpdated] = useState(false);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productosRes, categoriaRes] = await Promise.all([
                    axios.get(`${BACKEND_URL}/api/tienda/productos/categoria/${categoriaId}`),
                    axios.get(`${BACKEND_URL}/api/tienda/categorias/${categoriaId}`),
                ]);
                setProductos(productosRes.data);
                setCategoria(categoriaRes.data);
            } catch (error) {
                console.log(error);
            }
            setIsDataUpdated(false);
        };
        fetchData();
    }, [isDataUpdated, categoriaId]);

    return (
        <div className="container position-relative justify-content-between">
            <div className="d-flex justify-content-between mb-5">
                <h1>{categoria?.cat_nom}</h1>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-5">
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
            <Link to={`/menu`} className='btn btn-warning position-absolute top-0 end-0 mx-5 my-4'>Volver <i className="bi bi-arrow-left"></i></Link>

        </div >
    )
}
