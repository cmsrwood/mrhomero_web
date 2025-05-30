// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../config/Api';

export default function Menu() {

    const [categorias, setCategorias] = useState([])
    const [productos, setProductos] = useState([])
    const [isDataUpdated, setIsDataUpdated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;
    const rol = token ? JSON.parse(atob(token.split(".")[1])).rol : 0;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [categoriasRes, productosRes] = await Promise.all([
                    API.get(`/api/tienda/categorias/`),
                    API.get(`/api/tienda/productos/`),
                ]);
                setCategorias(categoriasRes.data);
                setProductos(productosRes.data);
            } catch (error) {
                console.log(error);
            }
            setIsDataUpdated(false);
            setIsLoading(false);
        };
        fetchData();
    }, [isDataUpdated]);

    function rutaCategoria(rol, idCategoria) {
        switch (rol) {
            case 3:
                return `/cliente/categoria/${idCategoria}`
            case 2:
                return `/empleado/categoria/${idCategoria}`
            default:
                return `/categoria/${idCategoria}`
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

    return (
        <div className="">
            <div className="container">
                <h1 className="text-warning text-center mb-4">Menu</h1>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-5">
                    {isLoading && renderIsLoading(6)}
                    {categorias.map((categoria) => (
                        <div key={categoria.id_categoria} className="col rounded-5">
                            <Link to={rutaCategoria(rol, categoria.id_categoria)} className='text-decoration-none'>
                                <div className="card text-center rounded-5 border-0 containerzoom animationhover">
                                    <div className="divimagen w-100 pb-2">
                                        <img loading='lazy' src={`${categoria.cat_foto}`} height={300} width={'100%'} className="rounded-top-5" alt="..." style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div className="card-body text-white rounded-bottom-5 animationtext">
                                        <h5 className="homero">{categoria.cat_nom}</h5>
                                        <button className='btn btn-warning text-dark fw-bold rounded-pill'>{productos.reduce((total, producto) => producto.id_categoria === categoria.id_categoria ? total + 1 : total, 0)} Productos</button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}