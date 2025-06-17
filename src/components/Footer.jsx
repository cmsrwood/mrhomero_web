import React from "react";
import img from '/logo.png'
import { Link } from "react-router-dom";
import googlePlay from '../../src/assets/img/googlePlay.png'
import appStore from '../../src/assets/img/appStore.png'
import moment from "moment";

export default function Footer() {
    return (
        <div className="mt-5 pt-5">
            <div className="container border-top mt-5">
                <div className="py-4">
                    <img src={img} width={80} />
                </div>
                <div className="row">
                    <div className="col-12 col-sm-3">
                        <p className="fsfooter">
                            <span className="fw-bold fstext"> Mr. Homero: La receta del sabor que te hará volver por más.</span><br />
                            Disfruta de nuestras irresistibles hamburguesas, perros calientes, papas crocantes, bebidas refrescantes y mucho más. ¡El sabor único de Mr. Homero te espera! Conoce nuestro menú y vive una experiencia deliciosa.
                        </p>
                    </div>
                    <div className="col-12 col-sm-3">
                        <p className="fsfooter">
                            <span className="fw-bold fstext">Contacto</span> <br />
                            Cl. 25 Sur #6-30, San Cristóbal <br />
                            Bogotá, Cundinamarca <br />
                            Llamanos: 300 123 4567 <br />
                            Correos: 4bDd0@example.com <br />
                            <Link to={""} className="text-decoration-none text-reset">Trabaja con nosotros</Link><br />
                        </p>
                    </div>
                    <div className="col-12 col-sm-3">
                        <p className="fsfooter">
                            <span className="fw-bold fstext">Quienes Somos</span> <br />
                            <Link to={"/nosotros"} className="text-decoration-none text-reset">Nosotros</Link>
                        </p>
                        <p className="fsfooter">
                            <span className="fw-bold fstext">Horarios de atención</span> <br />
                            Martes a Viernes de 10:00 a 20:00 <br />
                            Sabados de 10:00 a 18:00
                        </p>
                    </div>
                    <div className="col-12 col-sm-3">
                        <p className="fsfooter">
                            <span className="fw-bold fstext">Descarga nuestra APP</span> <br />
                        </p>
                        <a href="../src/downloads/mrhomero.apk" target="_blank"><img src={googlePlay} width={150} /></a>
                        <Link><img src={appStore} width={150} /></Link>

                    </div>
                </div>
                <div className="row py-2">
                    <div className="col">
                        <a href="https://www.tiktok.com/@mrhomerocomidasrapidas" target="_blank" className="text-decoration-none text-reset fs-5"><i className="bi bi-tiktok"></i></a>
                        <a href="https://www.instagram.com/mrhomerocomidasrapidas/" target="_blank" className="text-decoration-none text-reset fs-5 px-3"><i className="bi bi-instagram"></i></a>
                        <a href="https://www.facebook.com/p/Comidas-Rapidas-Mr-Homero-100050735053665/?locale=es_LA" target="_blank" className="text-decoration-none text-reset fs-5"><i className="bi bi-facebook"></i></a>
                    </div>
                </div>
                <div className="row">
                    <div className="col border-top pt-2 text-center">
                        <p>
                            Mr. Homero © {moment().format('YYYY')}. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}