import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import API from '../../config/Api';
export default function Ventas() {

    const [ventas, setVentas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [Filtro, setFiltro] = useState({
        fecha: true,
        metodoDePago: true,
        total: true,
    });

    const [id_venta, setIdVenta] = useState('');
    const [detallesVentas, setDetallesVentas] = useState([]);

    const [isDataUpdated, setIsDataUpdated] = useState(false);
    const [searchTerm, setSearchTerms] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ventasRes, clientesRes] = await Promise.all([
                    API.get(`/api/tienda/ventas/`),
                    API.get(`/api/personas/clientes/`)
                ]);
                setVentas(ventasRes.data);
                setClientes(clientesRes.data);
            } catch (error) {
                console.log(error);
            }
            setIsDataUpdated(false);
        };

        fetchData();
    }, [isDataUpdated]);



    const handleSearch = (e) => {
        setSearchTerms(e.target.value);
    }

    const ventasFiltradas = ventas
        .filter(venta => estadoFiltro === null || venta.venta_estado === estadoFiltro)
        .sort(Filtro.fecha ? (a, b) => new Date(b.venta_fecha) - new Date(a.venta_fecha) : (a, b) => new Date(a.venta_fecha) - new Date(b.venta_fecha))
        .filter(venta => {
            const term = searchTerm.toLowerCase();
            return (
                venta.venta_metodo_pago.toLowerCase().includes(term) ||
                venta.venta_fecha.toLowerCase().includes(term) ||
                venta.venta_total.toString().toLowerCase().includes(term)
            );
        }
        );

    const eliminaVenta = async (id) => {
        try {
            const confirm = await Swal.fire({
                title: '¿Estás seguro de eliminar esta venta?',
                text: "La venta será eliminada",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar'
            });

            if (!confirm.isConfirmed) {
                return;
            }

            const response = await API.put(`/api/tienda/ventas/eliminar/${id}`);

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Venta eliminada exitosamente'
                });
                setIsDataUpdated(true);
            }
        } catch (error) {
            console.error('Error al eliminar venta:', error);
        }
    };

    const restaurarVenta = async (id) => {
        try {
            const confirm = await Swal.fire({
                title: '¿Estás seguro de que desea restaurar esta venta?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, restaurar'
            });

            if (!confirm.isConfirmed) {
                return;
            }

            const res = await API.put(`/api/tienda/ventas/restaurar/${id}`);
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Venta restaurada exitosamente'
                });
                setIsDataUpdated(true);
            }
        } catch (error) {
            console.error('Error al restaurar venta:', error);
        }
    };

    function filtrarVentasPorEstado(estado) {
        setEstadoFiltro(estado);
    }

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

    const parseNumber = (value) => {
        // Elimina puntos y convierte la cadena a número
        return parseFloat(value.replace(/\./g, '')) || 0;
    }

    return (
        <div>
            <div className="row">
                <h1 className="col-12 col-sm-6">Gestión de ventas</h1>
                <div className="col-12 col-sm-6 position-relative">
                    <div className="row">
                        <div className="col">
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control form-control-lg ps-5 w-100"
                                    placeholder="Buscar venta..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <i className={`bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary`}></i>
                            </div>
                        </div>
                        <div className="col">
                            {/* Dropdown para filtrar por estado */}
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Estado
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button className='btn w-100' onClick={() => filtrarVentasPorEstado(1)}>Realizadas</button>
                                    </li>
                                    <li>
                                        <button className='btn w-100' onClick={() => filtrarVentasPorEstado(0)}>Borradas</button>
                                    </li>
                                    <li>
                                        <button className='btn w-100' onClick={() => filtrarVentasPorEstado(null)}>Todas</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped mt-5">
                    <thead>
                        <tr>
                            <th scope="col">Fecha <button onClick={() => setFiltro({ ...Filtro, fecha: !Filtro.fecha })} className='btn'><i className={Filtro.fecha ? `bi bi-caret-down` : `bi bi-caret-up`}></i></button></th>
                            <th scope="col">Cliente</th>
                            <th scope="col">Método de pago</th>
                            <th scope="col">Total</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventasFiltradas.length > 0 ? (
                            ventasFiltradas.map((venta) => (
                                <React.Fragment key={venta.id_venta}>
                                    <tr>
                                        <td>{venta.venta_fecha}</td>
                                        <td className={clientes.find(cliente => cliente.id_user === venta.id_user) ? `text-success` : `text-danger`}>
                                            {clientes.find(cliente => cliente.id_user === venta.id_user) ? `${clientes.find(cliente => cliente.id_user === venta.id_user).user_nom} ${clientes.find(cliente => cliente.id_user === venta.id_user).user_apels}` : 'Cliente sin cuenta'}
                                        </td>
                                        <td>{venta.venta_metodo_pago}</td>
                                        <td>{formatNumber(venta.venta_total)}</td>
                                        <td className={venta.venta_estado === 1 ? 'text-success' : 'text-danger'}>
                                            {venta.venta_estado === 1 ? 'Realizada' : 'Borrada'}
                                        </td>
                                        <td>
                                            <button className="btn btn-primary me-2" onClick={() => mostrarDetalles(venta.id_venta)} data-bs-toggle="collapse" data-bs-target={`#collapse_${venta.id_venta}`} aria-expanded="false" aria-controls={`collapse${venta.id_venta}`}>
                                                <i className='bi bi-eye'></i>
                                            </button>
                                            {venta.venta_estado === 1
                                                ? <button type="button" className="btn btn-danger" onClick={() => eliminaVenta(venta.id_venta)}><i className="bi bi-trash"></i></button>
                                                : <button type="button" className="btn btn-success" onClick={() => restaurarVenta(venta.id_venta)}><i className="bi bi-arrow-counterclockwise"></i></button>}
                                        </td>
                                    </tr>
                                    <tr className="collapse wow animate__animated animate__fadeInLeft" id={`collapse_${venta.id_venta}`}>
                                        <td colSpan="6">
                                            <div className="card card-body">
                                                <p className='card-title'>Detalle de la venta con id {venta.id_venta}</p>
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
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No hay ventas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
