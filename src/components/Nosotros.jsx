import React from 'react'
import img from '/logo.png'
import banner from '../assets/img/banner-nosotros.jpg'
import homero from '../assets/img/homero.jpg'
import '../styles/style.css'


export default function Nosotros() {
    return (
        <div className="container">
            {/* Sección Hero */}
            <div className="row justify-content-center mb-5 ps-5">
                <div className="col-12 col-sm-8  fw-bold d-block align-content-center ">
                    <h2>SI LO QUE BUSCAS ES SABOR </h2>
                    <h2><span className='homero'>MR. HOMERO</span> ES LO MEJOR.</h2>
                </div>
                <div className="col-12 col-sm-4 text-center">
                    <img src={img} width={250} height={250} />
                </div>
            </div>

            <div className="container">
                {/* Historia */}
                <div className="row align-items-center mb-5 g-5">
                    <div className="col-md-6">
                        <h2 className="fw-bold text-warning mb-4">Nuestra Historia</h2>
                        <p className="lead text-muted">
                            Fundado en 2007, nuestro restaurante nació del sueño de compartir
                            los sabores auténticos de la cocina tradicional. Comenzamos como un pequeño puesto
                            callejero y hoy somos referencia gastronómica en la localidad de San Cristóbal.
                        </p>
                    </div>
                    <div className="col-md-6">
                        <img src={homero} alt="Historia" className="img-fluid rounded-3 shadow" />
                    </div>
                </div>

                {/* Misión y Visión */}
                <div className="row mb-5 g-4">
                    <div className="col-md-6">
                        <div className="p-4 border border-warning text-white rounded-3 shadow">
                            <h3 className="fw-bold mb-3">Misión</h3>
                            <p className="mb-0">
                                Ofrecer experiencias culinarias memorables preservando las recetas tradicionales,
                                utilizando ingredientes frescos y de calidad.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="p-4 border border-warning text-white rounded-3 shadow">
                            <h3 className="fw-bold mb-3">Visión</h3>
                            <p className="mb-0">
                                Ser reconocidos como el referente de la cocina tradicional innovadora, expandiendo
                                nuestra presencia manteniendo siempre la calidad.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Información de Contacto */}
                <div className="row mb-5 g-4">
                    <div className="col-lg-6">
                        <div className="p-4 rounded-3 shadow">
                            <h4 className="fw-bold text-warning mb-4">Contacto</h4>
                            <ul className="list-unstyled">
                                <li className="mb-3">
                                    <i className="bi bi-geo-alt-fill me-2 text-muted"></i>
                                    Cl. 25 Sur #6-30, San Cristóbal, Bogotá, Cundinamarca
                                </li>
                                <li className="mb-3">
                                    <i className="bi bi-telephone-fill me-2 text-muted"></i>
                                    (01) 123-4567
                                </li>
                                <li className="mb-3">
                                    <table class="table table-borderless">
                                        <thead>
                                            <tr>
                                                <th scope="col" className='fw-bold'>Dia</th>
                                                <th scope="col" className='fw-bold'>Horario</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Lunes</td>
                                                <td>Cerrado</td>
                                            </tr>
                                            <tr>
                                                <td>Martes</td>
                                                <td>12:30 p.m. a 9:00 p.m.</td>
                                            </tr>
                                            <tr>
                                                <td>Miércoles</td>
                                                <td>12:30 p.m. a 9:00 p.m.</td>
                                            </tr>
                                            <tr>
                                                <td>Jueves</td>
                                                <td>12:30 p.m. a 9:00 p.m.</td>
                                            </tr>
                                            <tr>
                                                <td>Viernes</td>
                                                <td>12:30 p.m. a 9:00 p.m.</td>
                                            </tr>
                                            <tr>
                                                <td>Sábado</td>
                                                <td>12:30 p.m. a 9:00 p.m.</td>
                                            </tr>
                                            <tr>
                                                <td>Domingo</td>
                                                <td>12:30 p.m. a 9:00 p.m.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="p-4 rounded-3 shadow h-100">
                            <h4 className="fw-bold text-warning mb-4">Ubicación</h4>
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.130511404541!2d-74.09657532432388!3d4.570561342770566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99d76341bfb1%3A0x7ec417835b16b0a7!2sMr.%20Homero%20Comidas%20R%C3%A1pidas!5e0!3m2!1ses!2sco!4v1748131562026!5m2!1ses!2sco" className='rounded border border-secondary' width="100%" height="400" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}