import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import useTema from '../hooks/useTema';
import useCerrarSesion from '../hooks/useCerrarSesion';

export default function NavegacionAdmin() {
    const { tema, cambiarTema } = useTema();
    const cerrarSesion = useCerrarSesion();

    const location = useLocation();
    const ruta = location.pathname.split("/")[2];

    function rutaActiva(link) {
        return ruta === link ? "text-warning" : "";
    }

    return (
        <div className="d-flex position-relative">
            <div className='min-vh-100 bg-dark text-white border-end sidebar shadow' id="sidebar"></div>
            <div className='min-vh-100 bg-dark text-white border-end sidebar position-fixed shadow' id="sidebar">
                <ul className=" pt-5 mt-4 pt-sm-5 mt-sm-5 list-unstyled">
                    <Link to="/admin/" className={rutaActiva('') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="bi bi-house "></i> <span className='d-none d-lg-inline'>Inicio</span>
                    </Link>
                    <Link className={rutaActiva('ventas') || rutaActiva('pedidos') || rutaActiva('dashboard') ? `nav-link ps-3 py-2 d-flex bg-warning w-100 text-start text-dark justify-content-between` : `nav-link ps-3 py-2 d-flex justify-content-between`} data-bs-toggle="collapse" data-bs-target="#collapseVentas">
                        <div className="">
                            <i className="bi bi-wallet2 me-1"></i>
                            <span className='d-none d-lg-inline'>Ventas</span>
                        </div>
                    </Link>
                    <div className={rutaActiva('dashboard') || rutaActiva('ventas') || rutaActiva('pedidos') ? `collapse show` : `collapse`} id="collapseVentas">
                        <Link to='/admin/dashboard' className={rutaActiva('dashboard') ? `nav-link ps-3 py-2 d-block bg-light opacity-75 fw w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                            <i className="bi bi-graph-up"></i> <span className='d-none d-lg-inline'>Analisis de ventas</span>
                        </Link>
                        <Link to='/admin/ventas' className={rutaActiva('ventas') ? `nav-link ps-3 py-2 d-block bg-light opacity-75 w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                            <i className="bi bi-pencil-square"></i> <span className='d-none d-lg-inline'>Gestion de ventas</span>
                        </Link>
                        <Link to='/admin/pedidos' className={rutaActiva('pedidos') ? `nav-link ps-3 py-2 d-block bg-light opacity-75 w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                            <i className="bi bi-check2-circle"></i> <span className='d-none d-lg-inline'>Pedidos</span>
                        </Link>
                    </div>
                    <Link to='/admin/inventario' className={rutaActiva('inventario') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="bi bi-inboxes"></i> <span className='d-none d-lg-inline'>Inventario</span>
                    </Link>

                    <Link to='/admin/menu' className={rutaActiva('menu') || rutaActiva('categoria') || rutaActiva('producto') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="fa fa-utensils"></i> <span className='d-none d-lg-inline'>Menú</span>
                    </Link>
                    <Link to='/admin/recompensas' className={rutaActiva('recompensas') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="bi bi-trophy"></i> <span className='d-none d-lg-inline'>Recompensas</span>
                    </Link>
                    <Link to='/admin/recompensasObtenidas' className={rutaActiva('recompensasObtenidas') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="bi bi-check-circle"></i> <span className='d-none d-lg-inline'>Recompensas obtenidas</span>
                    </Link>
                    <Link to='/admin/clientes' className={rutaActiva('clientes') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="bi bi-people"></i> <span className='d-none d-lg-inline'>Clientes</span>
                    </Link>
                    <Link className={rutaActiva('empleados') || rutaActiva('horasempleados') ? `nav-link ps-3 py-2 d-flex bg-warning w-100 text-start text-dark justify-content-between` : `nav-link ps-3 py-2 d-flex justify-content-between`} data-bs-toggle="collapse" data-bs-target="#collapseEmpleados">
                        <div className="">
                            <i className="bi bi-person-vcard me-1"></i>
                            <span className='d-none d-lg-inline'>Empleados</span>
                        </div>
                    </Link>
                    <div className={rutaActiva('empleados') || rutaActiva('horasempleados') || rutaActiva('pedidos') ? `collapse show` : `collapse`} id="collapseEmpleados">
                        <Link to='/admin/empleados' className={rutaActiva('empleados') ? `nav-link ps-3 py-2 d-block bg-light opacity-75 fw w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                            <i className="bi bi-person-badge"></i> <span className='d-none d-lg-inline'>Empleados</span>
                        </Link>
                        <Link to='/admin/horasempleados' className={rutaActiva('horasempleados') ? `nav-link ps-3 py-2 d-block bg-light opacity-75 w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                            <i className="bi bi-clock"></i> <span className='d-none d-lg-inline'>Horas de empleados</span>
                        </Link>
                    </div>
                    <Link to='/admin/proveedores' className={rutaActiva('proveedores') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="bi bi-basket3"></i> <span className='d-none d-lg-inline'>Proveedores</span>
                    </Link>
                </ul>
            </div>
            <nav className=" bg-dark navbar navbar-expand-lg border-bottom fixed-top shadow">
                <div className="container-fluid">
                    <Link className="navbar-brand text-warning homero-font fs-3" to="/admin/">Mr. Homero</Link>
                    <small className='text-white d-none d-sm-block fw-bold'>Hola, Administrador</small>
                    <div className="d-flex">
                        <div className="dropdown pe-5 me-5">
                            <button className="btn dropdown-toggle text-white" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-person-square "></i>
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/admin/perfil">Mi perfil</Link></li>
                                <li><Link className="dropdown-item text-danger" to="#" onClick={cerrarSesion}><i className="bi bi-box-arrow-right"></i> Cerrar sesión</Link></li>
                            </ul>
                        </div>
                        <button className='btn' onClick={cambiarTema} ><i id="botont" className={`bi bi-${tema === 'light' ? 'sun-fill' : 'moon-fill'} text-white`} ></i></button>
                    </div>
                </div>
            </nav>
        </div>
    )
}
