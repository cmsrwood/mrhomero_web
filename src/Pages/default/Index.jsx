// eslint-disable-next-line no-unused-vars
import React from 'react'
import img from '../../assets/img/banner-nosotros.jpg'
import logo from '/logo.png'
import { Link } from 'react-router-dom'

export default function IndexDefault() {

  return (
    <div className=''>
      <div className="container">
        <div className="row py-5">
          <div className="col-12 col-sm-8 ">
            <h1 className='fw-bold d-none d-sm-block'>SI LO QUE BUSCAS ES SABOR</h1>
            <h1 className='fw-bold d-none d-sm-block'>MR. HOMERO ES EL MEJOR</h1>
            {/* Responsive */}
            <h1 className='fw-bold d-block d-sm-none fs-1'>MR. HOMERO ES EL MEJOR</h1>
            <h1 className='fw-bold d-block d-sm-none fs-1'>SI LO QUE BUSCAS ES SABOR</h1>
            <p className='w-100 w-sm-75 py-2' style={{ fontSize: 17, lineHeight: 1.8 }}>¡Descubre el sabor que buscas con MrHomero! En nuestra app, puedes pedir las hamburguesas más deliciosas y tu comida rápida favorita en minutos. ¡Rápido, fácil y con entregas que te harán volver por más! ¿Antojo de una burger perfecta? ¡Descárgala ahora y disfruta el mejor sabor al alcance de tu mano!</p>
            <Link to="/registrar" className="btn btn-warning btn-lg rounded-pill px-4 py-2 shadow mx-2">
              <i className="bi bi-person-plus me-2"></i>Regístrate
            </Link>
            <Link to="/ingresar" className="btn btn-outline-warning btn-lg rounded-pill px-4 py-2 shadow">
              <i className="bi bi-box-arrow-in-right me-2"></i>Ingresar
            </Link>
          </div>
          <div className="col-12 col-sm-4 order-first order-sm-last text-center">
            <img src={logo} className='img-fluid' width={300} height={300} />
          </div>
        </div>
      </div>
      <div id="carouselExample" className="carousel slide mb-5">
        <div className="carousel-inner d-flex">
          <div className="carousel-item active">
            <img src={img} className="d-block m-auto img-fluid" style={{ objectFit: 'cover', maxHeight: 500, width: 1320 }} alt="..." />
          </div>
          <div className="carousel-item">
            <img src={img} className="d-block m-auto img-fluid" style={{ objectFit: 'cover', maxHeight: 500, width: 1320 }} alt="..." />
          </div>
          <div className="carousel-item">
            <img src={img} className="d-block m-auto img-fluid" style={{ objectFit: 'cover', maxHeight: 500, width: 1320 }} alt="..." />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="text-warning fs-5" aria-hidden="true"><i className="bi bi-caret-left-square"></i></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="text-warning fs-5" aria-hidden="true"><i className="bi bi-caret-right-square"></i></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  )
}
