import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import useTema from '../hooks/useTema';
import useCerrarSesion from '../hooks/useCerrarSesion';
import API from '../config/Api';


export default function NavegacionAdmin() {
    const token = localStorage.getItem('token');
    const id = JSON.parse(atob(token.split(".")[1])).id;
    
    const { tema, cambiarTema } = useTema();
    const cerrarSesion = useCerrarSesion();
    const [empleado, setEmpleado] = useState({});
    const [isDataUpdated, setIsDataUpdated] = useState(false);

    const location = useLocation();
    const ruta = location.pathname.split("/")[2];

    function rutaActiva(link) {
        return ruta === link ? "text-warning" : "";
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empleadoRes] = await Promise.all([
                    API.get(`/api/personas/empleados/${id}`),
                ]);
                setEmpleado(empleadoRes.data);
            } catch (error) {
                console.log(error);
            }
            setIsDataUpdated(false);
        };
        fetchData();
    }, [isDataUpdated, id]);

    return (
        <div className="d-flex position-relative">
            <div className='min-vh-100 bg-dark text-white border-end sidebar shadow' id="sidebar"></div>
            <div className='min-vh-100 bg-dark text-white border-end sidebar position-fixed shadow' id="sidebar">
                <ul className=" pt-5 mt-4 pt-sm-5 mt-sm-4 list-unstyled">

                    <Link className={rutaActiva('ventas') || rutaActiva('pedidos') || rutaActiva('dashboard') ? `nav-link ps-3 py-2 d-flex bg-warning w-100 text-start text-dark justify-content-between` : `nav-link ps-3 py-2 d-flex justify-content-between`} data-bs-toggle="collapse" data-bs-target="#collapseVentas">
                        <div className="">
                            <i className="bi bi-wallet2 me-1"></i>
                            <span className='d-none d-lg-inline'>Ventas</span>
                        </div>
                    </Link>
                    <div className={rutaActiva('dashboard') || rutaActiva('ventas') || rutaActiva('pedidos') ? `collapse show` : `collapse`} id="collapseVentas">
                        <Link to='/empleado/dashboard' className={rutaActiva('dashboard') ? `nav-link ps-3 py-2 d-block bg-light opacity-75 fw w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                            <i className="bi bi-graph-up"></i> <span className='d-none d-lg-inline'>Analisis de ventas</span>
                        </Link>
                        <Link to='/empleado/ventas' className={rutaActiva('ventas') ? `nav-link ps-3 py-2 d-block bg-light opacity-75 w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                            <i className="bi bi-pencil-square"></i> <span className='d-none d-lg-inline'>Gestion de ventas</span>
                        </Link>
                        <Link to='/empleado/pedidos' className={rutaActiva('pedidos') ? `nav-link ps-3 py-2 d-block bg-light opacity-75 w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                            <i className="bi bi-check2-circle"></i> <span className='d-none d-lg-inline'>Pedidos</span>
                        </Link>
                    </div>
                    <Link to='/empleado/inventario' className={rutaActiva('inventario') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="bi bi-inboxes"></i> <span className='d-none d-lg-inline'>Inventario</span>
                    </Link>

                    <Link to='/empleado/menu' className={rutaActiva('menu') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="fa fa-utensils"></i> <span className='d-none d-lg-inline'>Menú</span>
                    </Link>
                    <Link to='/empleado/recompensas' className={rutaActiva('recompensas') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="bi bi-trophy"></i> <span className='d-none d-lg-inline'>Recompensas</span>
                    </Link>
                    <Link to='/empleado/clientes' className={rutaActiva('clientes') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="bi bi-people"></i> <span className='d-none d-lg-inline'>Clientes</span>
                    </Link>
                    <Link to='/empleado/proveedores' className={rutaActiva('proveedores') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="bi bi-basket3"></i> <span className='d-none d-lg-inline'>Proveedores</span>
                    </Link>
                    <Link to='/empleado/horas' className={rutaActiva('horas') ? `nav-link ps-3 py-2 d-block bg-warning w-100 text-start text-dark` : `nav-link ps-3 py-2 d-block`}>
                        <i className="bi bi-clock"></i> <span className='d-none d-lg-inline'>Horas</span>
                    </Link>
                </ul>
            </div>
            <nav className=" bg-dark navbar navbar-expand-lg border-bottom fixed-top shadow">
                <div className="container-fluid">
                    <Link className="navbar-brand text-warning homero-font fs-3" to="#">Mr. Homero</Link>
                    <small className='text-white d-none d-sm-block fw-bold'>Hola, {empleado.user_nom}</small>
                    <div className="d-flex">
                        <div className="dropdown pe-5 me-5">
                            <button className="btn dropdown-toggle text-white" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-person-square "></i>
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/empleado/perfil">Mi perfil</Link></li>
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
