import React, { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import '../../styles/style.css'
import Swal from 'sweetalert2'
import img from '../../assets/img/img.png'
import uniqid from 'uniqid'
import axios from 'axios'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4400"

export default function RecompensasAdmin() {
  const driverObj = driver({
    showProgress: true,
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Finalizar',
    steps: [
      {
        element: '#buttonAnadir',
        popover: {
          title: 'Anadir Recompensa',
          description: 'Pulsa sobre el boton para anadir una recompensa',
          side: "right",
          align: 'center',
          onNextClick: () => {
            document.querySelector('#buttonAnadir')?.click();
            setTimeout(() => {
              driverObj.moveNext();
            }, 200);
          }
        }
      },
      {
        element: '#imagenCrearVisualizar',
        popover: {
          title: 'Imagen Recompensa',
          description: 'Pulsa sobre el boton para anadir una imagen a la recompensa',
          side: "center",
          align: 'center',
        }
      },
      {
        element: '#labelNombreCrear',
        popover: {
          title: 'Ingresar Nombre',
          description: 'Ingresar el nombre de la recompensa',
          side: "right",
          align: 'center',
        }
      },
      {
        element: '#labelPuntosCrear',
        popover: {
          title: 'Ingresar Puntos',
          description: 'Ingresar los puntos de la recompensa',
          side: "right",
          align: 'center',
        }
      },
      {
        element: '#floatingTextarea',
        popover: {
          title: 'Ingresar Descripcion',
          description: 'Ingresar la descripcion de la recompensa',
          side: "right",
          align: 'center',
        }
      },
      {
        element: '#buttonCrear',
        popover: {
          title: 'Crear Recompensa',
          description: 'Pulsa sobre el boton para crear la recompensa',
          side: "left",
          align: 'center'
        }
      },
      {
        element: '#buttonCerrar',
        popover: {
          title: 'Cerrar Recompensa',
          description: 'Pulsa sobre el boton para cerrar la recompensa',
          side: "right",
          align: 'center',
          onNextClick: () => {
            document.querySelector('#buttonCerrar')?.click();
            setTimeout(() => {
              driverObj.moveNext();
            }, 200);
          }
        }
      },
      {
        element: '#buttonEstado',
        popover: {
          title: 'Estado Recompensa',
          description: 'Pulsa sobre el boton para cambiar los estados que tienes en las recompensas',
          side: "right",
          align: 'center',
          onNextClick: () => {
            document.querySelector('#buttonEstado')?.click();
            setTimeout(() => {
              driverObj.moveNext();
            }, 200);
          }
        }
      },
      {
        element: '#activos',
        popover: {
          title: 'Recompensas Activas',
          description: 'Pulsa sobre el boton para ver las recompensas que tienes activas',
          side: "left",
          align: 'center'
        }
      },
      {
        element: '#inactivos',
        popover: {
          title: 'Recompensas Inactivas',
          description: 'Pulsa sobre el boton para ver las recompensas que tienes inactivas',
          side: "left",
          align: 'center'
        }
      },
      {
        element: '#todos',
        popover: {
          title: 'Ver todas las recompensas',
          description: 'Pulsa sobre el boton para ver todas las recompensas ya sean activas o inactivas',
          side: "left",
          align: 'center',
          onNextClick: () => {
            document.querySelector('#buttonEstado')?.click();
            setTimeout(() => {
              driverObj.moveNext();
            }, 200);
          }
        }
      },
      {
        element: '#contenedorRecompensas',
        popover: {
          title: 'Recompensas',
          description: 'Aqui puedes observar todas las recompensas que tienes',
          side: "left",
          align: 'center'
        }
      },
      {
        element: '#cardRecompensa',
        popover: {
          title: 'Recompensa',
          description: 'Aqui puedes observar una recompensa',
          side: "left",
          align: 'center'
        }
      },
      {
        element: '#buttonEditar',
        popover: {
          title: 'Editar Recompensa',
          description: 'Pulsa sobre el boton para editar la recompensa',
          side: "left",
          align: 'center',
        }
      },
      {
        element: '#eliminarRecompensa',
        popover: {
          title: 'Eliminar Recompensa',
          description: 'Pulsa sobre el boton para eliminar la recompensa',
          side: "left",
          align: 'center',
        }
      }
    ]
  })

  const handleTuto = async () => {
    const tuto = localStorage.getItem('needRecompensasTuto');
    if (tuto == null) {
      driverObj.drive();
      localStorage.setItem('needRecompensasTuto', false);
    }
    else if (tuto == true) {
      driverObj.drive();
    }
  }
  handleTuto();

  const [recompensas, setRecompensas] = useState([]);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recompensasRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/tienda/recompensas/`)
        ]);
        setRecompensas(recompensasRes.data);
      } catch (error) {
        console.log(error);
      }
      setIsDataUpdated(false);
    };
    fetchData();
  }, [isDataUpdated]);

  //Agregar recompensa
  const [recompensa, setRecompensa] = useState({
    nombre: '',
    descripcion: '',
    puntos: '',
    foto: null
  })

  const handleFileChange = (e) => {
    setRecompensa({ ...recompensa, foto: e.target.files[0] });
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  }

  const handleInputChange = (e) => {
    setRecompensa({ ...recompensa, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let nombre = recompensa.nombre;
    let nombreConGuiones = nombre.replace(/\s+/g, '_');
    const id_unico = `recompensa_${nombreConGuiones}_${uniqid()}`;
    try {
      const formData = new FormData();
      formData.append('id', id_unico);
      formData.append('foto', recompensa.foto);
      formData.append('upload_preset', 'recompensas');
      formData.append('public_id', id_unico);

      const cloudinaryResponse = await axios.post(`${BACKEND_URL}/api/imagenes/subir`, formData);

      const url = cloudinaryResponse.data.url;

      try {
        const recompensaData = {
          id: id_unico,
          nombre: recompensa.nombre,
          descripcion: recompensa.descripcion,
          puntos: recompensa.puntos,
          foto: url
        }
        const res = await axios.post(`${BACKEND_URL}/api/tienda/recompensas/crear`, recompensaData);
        Swal.fire({
          icon: 'success',
          title: res.data.message
        });
        if (res.status === 200) {
          setRecompensa({
            nombre: '',
            descripcion: '',
            puntos: '',
            foto: null
          });
          setIsDataUpdated(true);
        }
        setImagePreview('');
        setIsDataUpdated(true);
      } catch (error) {
        console.log(error);
        Swal.fire('Error', error.response.data, 'error');
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error', error.response.data, 'error');
    }

    const modalElement = document.getElementById('añadirRecompensa');
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    resetFoto();
  }

  //useREf para limpiar el input de la imagen 
  const fileInputRef = useRef(null);

  //Función para resetear el input dela imagen
  const resetFoto = () => {
    fileInputRef.current.value = '';
  }

  function filtrarRecompensasPorEstado(estado) {
    setEstadoFiltro(estado);
  }

  const recompensasFiltradas = recompensas
    .filter(recompensa => {
      return estadoFiltro === null || recompensa.recomp_estado === estadoFiltro;
    });

  //Editar recompensa
  const [editarRecompensa, setEditarRecompensa] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    puntos: 0,
    foto: null
  })

  const handleFileChangeEdit = (e) => {
    setEditarRecompensa({ ...editarRecompensa, foto_edit: e.target.files[0] });
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  }

  const handleInputChangeEdit = (e) => {
    setEditarRecompensa({ ...editarRecompensa, [e.target.name]: e.target.value })
  }

  const handleEdit = async (id) => {
    try {
      const recompensaData = {
        id: editarRecompensa.id,
        nombre: editarRecompensa.nombre,
        descripcion: editarRecompensa.descripcion,
        puntos: editarRecompensa.puntos,
      }
      const res = await axios.put(`${BACKEND_URL}/api/tienda/recompensas/actualizar/${id}`, recompensaData);
      if (res.status === 200) {
        try {
          if (imagePreview) {
            const formData = new FormData();
            formData.append('foto', editarRecompensa.foto_edit);
            formData.append('upload_preset', 'recompensas');
            formData.append('public_id', id);
            const cloudinaryResponse = await axios.post(`${BACKEND_URL}/api/imagenes/subir`, formData);
            const url = cloudinaryResponse.data.url;
            const response = await axios.put(`${BACKEND_URL}/api/tienda/recompensas/actualizar/${id}`, {
              foto: url
            });
            if (response.status === 200) {
              Swal.fire({
                icon: 'success',
                title: response.data.message
              });
              const modalElement = document.getElementById('recompensaEditarModal');
              let modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance.hide();
              setImagePreview("");
              setIsDataUpdated(true);
            }
          } else {
            Swal.fire({
              icon: 'success',
              title: res.data.message
            });
            const modalElement = document.getElementById('recompensaEditarModal');
            let modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            setImagePreview("");
            setIsDataUpdated(true);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error', error.response?.data || 'error');
    }
  }

  function openEditModal(recompensa) {
    setEditarRecompensa({
      id: recompensa.id_recomp,
      nombre: recompensa.recompensa_nombre,
      descripcion: recompensa.recompensa_descripcion,
      puntos: recompensa.recomp_num_puntos,
      foto: recompensa.recomp_foto
    });
  }

  //Eliminar recompensa
  const eliminarRecompensa = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: '¿Estas seguro de eliminar esta recompensa?',
        text: "No podrás revertir estaacción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
      })
      if (confirm.isConfirmed) {
        const response = await axios.put(`${BACKEND_URL}/api/tienda/recompensas/eliminar/${id}`);
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: response.data.message
          });
          setIsDataUpdated(true);
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error', error.response?.data || 'error');
    }
  }

  const restaurarRecompensa = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: '¿Estas seguro de restaurar esta recompensa?',
        text: "No podrás revertir estaacción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, restaurar'
      })
      if (confirm.isConfirmed) {
        const response = await axios.put(`${BACKEND_URL}/api/tienda/recompensas/restaurar/${id}`);
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: response.data.message
          });
          setIsDataUpdated(true);
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error', error.response?.data || 'error');
    }
  }

  return (
    <div className=''>
      <div className="d-flex justify-content-between mb-5">
        <h1>Recompensas</h1>
        <div className="d-flex align-items-center">
          <div className="col me-5">
            {/* Dropdown para filtrar por estado */}
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id='buttonEstado'>
                Estado
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button className='btn w-100' id='activos' onClick={() => filtrarRecompensasPorEstado(1)}>Activos</button>
                </li>
                <li>
                  <button className='btn w-100' id='inactivos' onClick={() => filtrarRecompensasPorEstado(0)}>Inactivos</button>
                </li>
                <li>
                  <button className='btn w-100' id='todos' onClick={() => filtrarRecompensasPorEstado(null)}>Todos</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#añadirRecompensa" id='buttonAnadir'><i className="bi bi-plus"></i>Añadir</button>
      </div>

      {/* Modal para agregar recompensa */}

      <div className="modal fade" id="añadirRecompensa" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Añadir recompensa</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="container">
                <div className="row">
                  <div className="col-3 m-2 ps-1 pt-2" id='imagenCrearVisualizar'>
                    <img src={imagePreview || img} height={200} width={280} style={{ objectFit: 'cover' }} className='card-img-center border mb-4' alt="..." />
                    <input ref={fileInputRef} className='form-control' onChange={handleFileChange} type="file" accept='image/*' autoComplete='off' id='foto' name='foto' required />
                  </div>
                  <div className="col ms-3">
                    <label htmlFor="floatingInput">Nombre</label>
                    <input type="text" name='nombre' id='labelNombreCrear' onChange={handleInputChange} className="form-control my-2" placeholder="Nombre" value={recompensa.nombre} />
                    <label htmlFor="floatingInput">Puntos</label>
                    <input type="number" name='puntos' id='labelPuntosCrear' onChange={handleInputChange} className="form-control my-2" placeholder="Puntos" value={recompensa.puntos} min="0" />
                    <label htmlFor="floatingInput">Descripcion</label>
                    <textarea type="text" name='descripcion' onChange={handleInputChange} className="form-control my-2" placeholder="Descripción" id="floatingTextarea" value={recompensa.descripcion}></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" id='buttonCerrar' className="btn btn-danger" data-bs-dismiss="modal"><i className="bi bi-x-circle"></i></button>
                <button type="submit" id='buttonCrear' className="btn btn-success" onClick={handleSubmit}><i className="bi bi-check-circle"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="" id='contenedorRecompensas'>
        <Swiper
          slidesPerView={4}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          scrollbar={{ hide: true }}
          modules={[Scrollbar]}
        >
          {recompensasFiltradas.length === 0 && (
            <div className="d-flex justify-content-center align-items-center h-100">
              <h1>No hay recompensas</h1>
            </div>
          )}
          {recompensasFiltradas.map((recompensa) => (
            <SwiperSlide className="h-100" id='cardRecompensa' key={recompensa.id_recomp}>
              <div className="card text-center">
                <img src={`${recompensa.recomp_foto}`} height={200} style={{ objectFit: 'cover' }} className="card-img-top" alt="..." />
                <div className="card-body">
                  <h3 className="card-title" style={{ height: '3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{recompensa.recompensa_nombre}</h3>
                  <p className="card-text text-muted" style={{ height: '3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{recompensa.recompensa_descripcion}</p>
                  <button type="button" className="btn btn-warning mx-4" id='buttonEditar' data-bs-toggle="modal" data-bs-target="#recompensaEditarModal" onClick={() => openEditModal(recompensa)}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  {recompensa.recomp_estado === 0 ?
                    <button type="button" className="btn btn-success mx-4" id='restaurarRecompensa' onClick={() => restaurarRecompensa(recompensa.id_recomp)}><i className="bi bi-arrow-counterclockwise"></i></button>
                    :
                    <button type="button" className="btn btn-danger mx-4" id='eliminarRecompensa' onClick={() => eliminarRecompensa(recompensa.id_recomp)}><i className="bi bi-trash"></i> </button>
                  }
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="modal fade" id="recompensaEditarModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Editar información</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="conatiner">
                <div className="row">
                  <div className="col-3 m-3 ps-3 pt-2">
                    <img src={imagePreview ? imagePreview : `${editarRecompensa.foto}`} className="mb-3 rounded" alt="Imagen actual" height={200} width={250} style={{ objectFit: 'cover' }} />
                    <input onChange={handleFileChangeEdit} className='form-control' type="file" accept='image/*' id='foto' name='foto' />
                  </div>
                  <div className="col">
                    <label htmlFor="floatingInput">Nombre</label>
                    <input type="text" className="form-control my-2" name='nombre' onChange={handleInputChangeEdit} value={editarRecompensa.nombre} placeholder="Nombre" aria-label="Username" aria-describedby="basic-addon1"></input>

                    <label htmlFor="floatingInput">Puntos</label>
                    <input type="number" className="form-control my-2" name='puntos' onChange={handleInputChangeEdit} value={editarRecompensa.puntos} placeholder="Puntos" aria-label="Username" aria-describedby="basic-addon1" ></input>

                    <label htmlFor="floatingInput">Descripción</label>
                    <textarea className='form-control' name='descripcion' onChange={handleInputChangeEdit} value={editarRecompensa.descripcion} id="descripcion" placeholder='Inserte la descripcion' ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-success" onClick={() => { handleEdit(editarRecompensa.id) }}>Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
