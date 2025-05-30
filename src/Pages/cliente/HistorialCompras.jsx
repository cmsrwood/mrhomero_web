import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import API from '../../config/Api';

export default function HistorialCompras() {

    const [isDataUpdated, setIsDataUpdated] = useState(false);

    const [compras, setCompras] = useState([]);
    const [detallesVentas, setDetallesVentas] = useState({});
    const [id_venta, setIdVenta] = useState(0);

    const token = localStorage.getItem('token');
    const idUsuario = JSON.parse(atob(token.split(".")[1])).id;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [comprasRes] = await Promise.all([
                    API.get(`/api/tienda/ventas/cliente/${idUsuario}`),
                ]);
                setCompras(comprasRes.data);
            } catch (error) {
                console.log(error);
            }
            setIsDataUpdated(false);
        };
        fetchData();
    }, [isDataUpdated, idUsuario]);

    const mostrarDetalles = async (id_venta) => {
        setIdVenta(id_venta);
        try {
            const detalleVentaRes = await API.get(`/api/tienda/ventas/detalle/${id_venta}`);
            const detallesConProducto = await Promise.all(
                detalleVentaRes.data.map(async (detalle) => {
                    const productoRes = await API.get(`/api/tienda/productos/${detalle.id_producto}`);
                    return { ...detalle, producto: productoRes.data };
                })
            );
            setDetallesVentas((prevDetalles) => ({
                ...prevDetalles,
                [id_venta]: detallesConProducto
            }));
        } catch (error) {
            console.error("Error al obtener detalles de venta:", error);
        }
    };

    const formatNumber = (value) => {
        // Convertir el valor a cadena y eliminar caracteres no numéricos
        const formattedValue = value.toString().replace(/\D/g, '');
        // Añadir puntos como separadores de miles
        return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };


    function mesANombre(mes) {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return meses[mes - 1];
    }

    return (
        compras.length > 0 ?
            <div className="py-5 container">
                <div className="text-center">
                    <h1 className="pb-3">Historial de compras</h1>
                </div>
                <div className="row row-cols-1 row-cols-sm-2 g-5">
                    {compras.map((venta) => (
                        <div className='col' key={venta.id_venta}>
                            <div className="card p-0 shadow">
                                <div className='card-header'>
                                    {moment(venta.venta_fecha).format('DD')} de {mesANombre(moment(venta.venta_fecha).format('MM'))}
                                </div>
                                <div className="card-body">
                                    <div className='d-flex justify-content-between'>
                                        <div className="text-center align-self-center">
                                            <h1 className="card-title">${formatNumber(venta.venta_total)}</h1>
                                        </div>
                                        <div className="align-self-center">
                                            <button className="btn btn-warning me-2" onClick={() => mostrarDetalles(venta.id_venta)} data-bs-toggle="modal" data-bs-target={`#modal_${venta.id_venta}`} aria-controls={`modal_${venta.id_venta}`} aria-expanded="false" >
                                                Ver compra
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        {moment(venta.venta_fecha).format('HH:mm:ss')}
                                    </div>
                                    <div className="modal fade" id={`modal_${venta.id_venta}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-xl">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Detalle de la compra</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    {detallesVentas[venta.id_venta] && detallesVentas[venta.id_venta].length > 0 ? (
                                                        <table className="table table-striped table-hover border border-1">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Cantidad</th>
                                                                    <th scope="col">Producto</th>
                                                                    <th scope="col">Precio</th>
                                                                    <th scope="col">Puntos</th>
                                                                    <th scope='col'>Subtotal</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {detallesVentas[venta.id_venta].map((detalle) => (
                                                                    <React.Fragment key={detalle.id_detalle}>
                                                                        <tr key={detalle.id_detalle}>
                                                                            <td>{detalle.cantidad_producto}</td>
                                                                            <td>{detalle.producto.pro_nom}</td>
                                                                            <td>{formatNumber(detalle.producto.pro_precio)}</td>
                                                                            <td>{formatNumber(detalle.producto.pro_puntos)}</td>
                                                                            <td className=''>{formatNumber(detalle.subtotal)}</td>
                                                                        </tr>
                                                                    </React.Fragment>
                                                                ))}
                                                                <tr className='fw-bold'>
                                                                    <td >Total:</td>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td className='text-warning'>{formatNumber(detallesVentas[venta.id_venta].reduce((total, detalle) => total + detalle.producto.pro_puntos * detalle.cantidad_producto, 0))}</td>
                                                                    <td className='text-warning'>{formatNumber(venta.venta_total)}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p>No hay detalles de la venta</p>
                                                    )}
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal"><i className="bi bi-x-lg"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            :
            <div className="py-5 container">
                <div className="row">
                    <div className="col text-center">
                        <h1 className="font-weight-bold">Historial de compras</h1>
                        <h3 className="text-muted">No tienes compras aún</h3>
                    </div>
                </div>
                <div className="row justify-content-center mt-4">
                    <div className="col-auto">
                        <Link className='btn btn-warning me-3' to={'/cliente/menu'}><i className='bi bi-list'></i> Menu </Link>
                    </div>
                </div>
            </div>

    )
}
