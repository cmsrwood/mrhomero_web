import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { NumericFormat } from 'react-number-format';
import API from '../config/Api';

export default function Producto() {
    const [producto, setProducto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const token = localStorage.getItem('token');
    const idProducto = token ? location.pathname.split("/")[3] : location.pathname.split("/")[2];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await API.get(`/api/tienda/productos/${idProducto}`);
                setProducto(res.data);
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [idProducto]);

    return (
        <div className=''>
            <div className="container position-relative">
                <div className="row">
                    <div className="col-12 col-sm-5 pt-4">
                        {isLoading ?
                            <div className="placeholder-glow">
                                <span className="placeholder col-12 rounded-5" style={{ height: '400px' }}></span>
                            </div>
                            :
                            <img loading='lazy' className='rounded-5 w-100 h-100' src={`${producto?.pro_foto}`} alt="" />
                        }
                    </div>
                    <div className="col-12 col-sm-7 px-5 py-3">
                        <h2 className='display-5 fw-bold'>{producto?.pro_nom ? producto?.pro_nom : 'Cargando producto...'}</h2>
                        <h4 className='py-3'><span className='text-muted'>{producto?.pro_desp ? producto?.pro_desp : 'Cargando...'}</span></h4>
                        <h4 className='py-3'>{producto?.pro_puntos ? producto?.pro_puntos : 'Cargando...'} puntos</h4>
                        {isLoading && <span className='display-5 text-muted'>Cargando...</span>}
                        <NumericFormat className='display-5 text-warning' value={producto?.pro_precio} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'$ '} />
                    </div>
                </div>
                <Link to={`/categoria/${producto?.id_categoria}`} className={`btn btn-warning position-absolute top-0 end-0 mx-5 my-4 ${isLoading ? 'd-none' : ''}`}>Volver <i className="bi bi-arrow-left"></i></Link>
            </div>
        </div>
    );

}
