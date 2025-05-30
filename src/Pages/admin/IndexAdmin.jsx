import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import API from '../../config/Api';

export default function IndexAdmin() {

  const driverObj = driver({
    showProgress: true,
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Finalizar',
    time: 100,
    steps: [
      {
        element: '#banner',
        popover: {
          titile: 'Inicio',
          description: 'Bienvenido al inicio, en esta seccion encontrarás una serie de estadísticas que te ayudaran a tomar decisiones informadas y tomar decisiones informadas en tu negocio.',
          side: "center",
          align: 'center'
        }
      },
      {
        element: '#funciones',
        popover: {
          title: 'Funciones',
          description: 'En esta sección podrás observar las funciones más realizadas por ',
        }
      }, {
        element: '#vistas',
        popover: {
          title: 'Vistas al aplicativo',
          description: 'En esta sección podrás observar las vistas al aplicativo'
        }
      },
      {
        element: '#registros',
        popover: {
          title: 'Nuevos usuarios',
          description: 'Aquí podrás observar la cantidad de usuarios registrados recientemente'
        }
      },
      {
        element: '#resenas',
        popover: {
          title: 'Reseñas',
          description: 'Aquí podrás observar las reseñas al restaurante',
          onNextClick: () => {
            document.querySelector('#resenas')?.click();
            setTimeout(() => {
              driverObj.moveNext();
            }, 200)
          }
        }
      },
      {
        element: '#resenasgoogle',
        popover: {
          title: 'Reseñas',
          description: 'Aquí podrás observar las reseñas de los clientes',
          onNextClick: () => {
            document.querySelector('#resenasclose')?.click();
            setTimeout(() => {
              driverObj.moveNext();
            }, 200)
          }
        }
      },
      {
        element: '#fin',
        popover: {
          title: 'Fin del tutorial',
          description: 'Usando este boton podrás observar el tutorial nuevamente'
        }
      }
    ]
  });

  const [clientes, setClientes] = useState([]);
  const [clientesUltimoMes, setClientesUltimoMes] = useState([]);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [resenas, setResenas] = useState([]);
  const [ratingResenas, setRatingResenas] = useState(0);
  const [admin, setAdmin] = useState([]);
  const token = localStorage.getItem('token');
  const id = JSON.parse(atob(token.split(".")[1])).id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, clientesUltimoMesRes, resenasRes, ratingResenasRes, adminRes] = await Promise.all([
          API.get(`/api/personas/clientes/`),
          API.get(`/api/personas/clientes/reportes/cuentaClientesUltimoMes`),
          API.get(`/api/personas/clientes/resenas/datos/`),
          API.get(`/api/personas/clientes/resenas/datos/rating/`),
          API.get(`/api/personas/admin/${id}`),
        ]);
        setClientes(clientesRes.data);
        setClientesUltimoMes(clientesUltimoMesRes.data);
        setResenas(resenasRes.data);
        setRatingResenas(ratingResenasRes.data);
        setAdmin(adminRes.data);
      } catch (error) {
        console.log(error);
      }
      setIsDataUpdated(false);
    };
    fetchData();
  }, [isDataUpdated]);

  const fullStarIcon = <i className='bi bi-star-fill text-warning'></i>;
  const halfStarIcon = <i className='bi bi-star-half text-warning'></i>;
  const emptyStarIcon = <i className='bi bi-star text-warning'></i>;

  function calcularEstrellas(rating, maxStars = 5) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = maxStars - fullStars - halfStar;

    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => (
          <span className='px-1' key={`full-${i}`}>{fullStarIcon}</span>
        ))}
        {halfStar ? <span className='px-1' key="half">{halfStarIcon}</span> : null}
        {Array.from({ length: emptyStars }, (_, i) => (
          <span className='px-1' key={`empty-${i}`}>{emptyStarIcon}</span>
        ))}
      </>
    );
  }

  const handleTuto = async () => {
    const tuto = localStorage.getItem('needInicioTuto');
    if (tuto == null) {
      setTimeout(() => {
        driverObj.drive();
      }, 1000);
      localStorage.setItem('needInicioTuto', false);
    }
    else if (tuto == true) {

      setTimeout(() => {
        driverObj.drive();
      }, 1000);
    }
  };
  const activateTuto = () => {
    driverObj.drive();
  };
  handleTuto();




  return (
    <div className=''>
      <div className='text-center pb-3 pt-3' >
        <h1>Mr. Homero | Inicio</h1>
      </div>
      <div className='container border border-2 border-secondary p-3 mb-2' id='funciones'>
        <h3 className='m-3'>Bienvenido {admin.user_nom} {admin.user_apels}</h3>
        <p className='m-3'>Estas son algunas de las funciones disponibles</p>
        <div className='row aling items-center m-2'>
          <div className='col'>
            <h5>Ventas</h5>
            <Link to='/admin/dashboard' className='d-block mx-1 text-decoration-none w-50'>Analisis de ventas</Link>
            <Link to='/admin/ventas' className='d-block mx-1 text-decoration-none w-50'>Gestion de ventas</Link>
            <Link to='/admin/pedidos' className='d-block mx-1 text-decoration-none w-50'>Pedidos</Link>
          </div>
          <div className='col'>
            <h5>Recompensas</h5>
            <Link to='/admin/recompensas' className='d-block mx-1 text-decoration-none w-50'>Recompensas</Link>
            <Link to='/admin/recompensasObtenidas' className='d-block mx-1 text-decoration-none w-50'>Recompensas obtenidas</Link>
          </div>
          <div className='col'>
            <h5>Gestion de usuarios</h5>
            <Link to='/admin/clientes' className='d-block mx-1 text-decoration-none w-50'>Clientes</Link>
            <Link to='/admin/empleados' className='d-block mx-1 text-decoration-none w-50'>Empleados</Link>
            <Link to='/admin/proveedores' className='d-block mx-1 text-decoration-none w-50'>Proveedores</Link>
          </div>
        </div>
      </div>
      <div className='container pt-3'>
        <div className="row  g-4">
          <div className="col-12 col-sm border border-2 border-secondary text-center align-content-center py-5" id='vistas'>
            <h3 className=''>Visitas del aplicativo</h3>
            <h5 className='pt-2'>999 Visitas recientes</h5>
            <h4 className='pt-2 text-success'>+ 8% este mes</h4>
          </div>
          <div className="col-12 col-sm border border-2 border-secondary text-center mx-0 mx-sm-3 align-content-cente py-5" id='registros'>
            <h3 className=''>Usuarios registrados</h3>
            <h5 className='pt-2 '>{clientes?.length} Usuarios registrados</h5>
            <h4 className='pt-2 text-success'>+{clientesUltimoMes?.length} este mes</h4>
          </div>
          <Link type="button" className=" col-12 col-sm border border-2 border-secondary text-center align-content-center py-5 text-decoration-none" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id='resenas' >
            <div>
              <h3 className=''>Reseñas</h3>
              <h5 className='pt-2'>{ratingResenas} de promedio</h5>
              <h4 className='pt-2'>{calcularEstrellas(ratingResenas, 5)}</h4>
            </div>
          </Link>

          <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content" id='resenasgoogle'>
                <div className="modal-header">
                  <h1 className="modal-title fs-2" id="staticBackdropLabel">Reseñas de los clientes</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <Swiper
                    slidesPerView={3}
                    spaceBetween={10}
                    pagination={{
                      clickable: true,
                    }}
                    scrollbar={{ hide: true }}
                    modules={[Scrollbar]}
                  >
                    {resenas.map((resena) => (
                      <SwiperSlide className="card" style={{ height: "auto" }} key={resena.time}>
                        <div className="card-body">
                          <div className="row align-items-center py-3">
                            <div className="col-4 align-content-center">
                              <img loading='lazy' className='img-fluid' src={resena.profile_photo_url ? resena.profile_photo_url : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} />
                            </div>
                            <div className="col-8 d-block align-content-center">
                              <h5 className="card-title fw-bold">{resena.author_name}</h5>
                              <p className="card-text">{resena.relative_time_description}</p>
                            </div>
                          </div>
                          <p className="card-text">{calcularEstrellas(resena.rating, 5)}</p>
                          <p className="card-text scrollbar-swiper">{resena.text}</p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <div className="modal-footer">
                  <button id='resenasclose' type="button" className="btn btn-outline-warning" data-bs-dismiss="modal" aria-label="Close">Entendido</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 text-end mb-5">
          <a href="#" className='text-end text-secondary text-decoration-none' id='fin'><small className='' onClick={() => { activateTuto() }}>Ver tutorial nuevamente</small></a>
        </div>
      </div>
    </div>
  )
}
