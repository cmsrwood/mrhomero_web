import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import API from '../../config/Api';

export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerms] = useState('');
    const [isDataUpdated, setIsDataUpdated] = useState(false);
    const [estadoFiltro, setEstadoFiltro] = useState(1);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await API.get(`/api/personas/clientes/`);
                setClientes(res.data);
                setIsDataUpdated(false);
            } catch (error) {
                console.error('Error al obtener clientes:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (isDataUpdated) {
            const fetchData = async () => {
                try {
                    const res = await API.get(`/api/personas/clientes/`);
                    setClientes(res.data);
                    setIsDataUpdated(false);
                } catch (error) {
                    console.error('Error al obtener clientes actualizados:', error);
                }
            };

            fetchData();
        }
    }, [isDataUpdated]);

    function filtrarClientesPorEstado(estado) {
        setEstadoFiltro(estado);
    }

    const clientesFiltrados = clientes
        .filter(cliente => {
            return estadoFiltro === null || cliente.user_estado === estadoFiltro;
        })
        .filter(cliente => {
            const term = searchTerm.toLowerCase();
            return (
                cliente.user_nom.toLowerCase().includes(term) ||
                cliente.user_apels.toLowerCase().includes(term) ||
                cliente.user_email.toLowerCase().includes(term)
            );
        });
    // Manejo del input de búsqueda
    const handleSearch = (e) => {
        setSearchTerms(e.target.value);
    }

    return (
        <div className="">
            <div className="row">
                <h1 className="col-12 col-sm-6">Clientes</h1>
                <div className="col-12 col-sm-6 position-relative">
                    <div className="row">
                        <div className="col">
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control form-control-lg ps-5 w-100"
                                    placeholder="Buscar usuario..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <i className={`bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary`}></i>
                            </div>
                        </div>
                        <div className="col">
                            {/* Dropdown para filtrar por estado */}
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle btn-warning mt-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Estado
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button className='btn w-100' onClick={() => filtrarClientesPorEstado(1)}>Activos</button>
                                    </li>
                                    <li>
                                        <button className='btn w-100' onClick={() => filtrarClientesPorEstado(0)}>Inactivos</button>
                                    </li>
                                    <li>
                                        <button className='btn w-100' onClick={() => filtrarClientesPorEstado(null)}>Todos</button>
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
                            <th scope="col">id</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellidos</th>
                            <th scope="col">Correo</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientesFiltrados.map(cliente => (
                            <tr key={cliente.id_user}>
                                <th scope="row">{cliente.id_user}</th>
                                <td>{cliente.user_nom}</td>
                                <td>{cliente.user_apels}</td>
                                <td>{cliente.user_email}</td>
                                <td className={cliente.user_estado === 1 ? 'text-success' : 'text-danger'}>
                                    {cliente.user_estado === 1 ? 'Activo' : 'Inactivo'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item">
                        <a className="page-link text-warning" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li className="page-item"><a className="page-link text-warning" href="#">1</a></li>
                    <li className="page-item"><a className="page-link text-warning" href="#">2</a></li>
                    <li className="page-item"><a className="page-link text-warning" href="#">3</a></li>
                    <li className="page-item">
                        <a className="page-link text-warning" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}
