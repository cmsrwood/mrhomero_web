import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useTema from '../hooks/useTema';

export default function NavegacionDefault() {

  const { tema, cambiarTema } = useTema();
  const location = useLocation();
  const ruta = location.pathname.split("/")[1];

  function rutaActiva(link) {
    return ruta === link ? "text-warning" : "";
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow mb-5">
      <div className="container-fluid">
        <Link className="navbar-brand text-warning fs-3 ps-2 homero-font" to="/">Mr. Homero</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <Link className={`nav-link mx-2 ${rutaActiva('nosotros')} fs-5`} to="/nosotros">
            <i className="bi bi-people-fill me-1"></i>Nosotros
          </Link>
          <Link className={`nav-link mx-2 ${rutaActiva('menu') || rutaActiva('categoria') || rutaActiva('producto')} fs-5`} to="/menu">
            <i className="bi bi-list-ul me-1"></i>Menú
          </Link>
          <Link className={`nav-link mx-2 ${rutaActiva('registrar')} fs-5`} to="/registrar">Crear mi cuenta</Link>
          <Link className={`nav-link mx-2 ${rutaActiva('ingresar')} fs-5`} to="/ingresar">Ingresar</Link>
          <button className='btn' onClick={cambiarTema} ><i id="botont" className={`bi bi-${tema === 'light' ? 'sun-fill' : 'moon-fill'}`} ></i></button>
        </div>
      </div>
    </nav>
  );
}
