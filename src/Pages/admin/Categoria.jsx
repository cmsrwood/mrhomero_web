import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import img from '../../assets/img/img.png'
import { NumericFormat } from 'react-number-format';
import Swal from 'sweetalert2';
import uniqid from 'uniqid';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import API from '../../config/Api';

export default function Categoria() {

  const driverObj = driver({
    showProgress: true,
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Finalizar',

    steps: [
      {
        element: '#verCategorias',
        popover: {
          title: 'Productos',
          description: 'Aqui podras ver todos los productos de la categoria',
          side: "right",
          align: 'center',
        }
      },
      {
        element: '#crearProducto',
        popover: {
          title: 'Crear Producto',
          description: 'Pulsa sobre el boton para crear un nuevo producto',
          side: "right",
          align: 'center'
        }
      },
      {
        element: '#buttonEstado',
        popover: {
          title: 'Filtros',
          description: 'Pulsa sobre el boton para filtrar los productos por estado',
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
          title: 'Activos',
          description: 'Pulsa sobre el boton para ver todos los producos que estan activos para la venta',
          side: "right",
          align: 'center'
        }
      },
      {
        element: '#inactivos',
        popover: {
          title: 'Inactivos',
          description: 'Pulsa sobre el boton para ver todos los producos que estan inactivos y no se mostraran a la venta para el publico',
          side: "right",
          align: 'center'
        }
      },
      {
        element: '#todos',
        popover: {
          title: 'Ver todos los productos',
          description: 'Pulsa sobre el boton para ver todos los productos ya sean activos o inactivos',
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
        element: '#estadoProducto',
        popover: {
          title: 'Estado del producto',
          description: 'Cada producto muestra el estado, asi será más fácil para la persona saber sí el producto esta activo o inactivo',
          side: "right",
          align: 'center',
          onNextClick: () => {
            document.querySelector('#estadoProducto')?.click();
            setTimeout(() => {
              driverObj.moveNext();
            }, 200);
          }
        }
      },
      {
        element: '#buttonEliminar',
        popover: {
          title: 'Eliminar Producto',
          description: 'Pulsa sobre el boton para cambiar el estado de un producto a inactivo, para que no se muestre en la tienda',
          side: "right",
          align: 'center'
        }
      },
      {
        element: '#buttonEditar',
        popover: {
          title: 'Editar Producto',
          description: 'Pulsa sobre el boton para cambiar información del producto',
          side: "right",
          align: 'center'
        }
      },
      {
        element: '#buttonVer',
        popover: {
          title: 'Ver Producto',
          description: 'Pulsa sobre el boton para observar toda la información del producto totalmente detallada',
          side: "right",
          align: 'center',
          onNextClick: () => {
            document.querySelector('#buttonVer')?.click();
            setTimeout(() => {
              driverObj.moveNext();
            }, 200);
          }
        }
      }
    ]
  })

  const handleTuto = async () => {
    const tuto = localStorage.getItem('needCategoriaTuto');
    if (tuto == null) {
      driverObj.drive();
      localStorage.setItem('needCategoriaTuto', false);
    }
    else if (tuto == true) {
      driverObj.drive();
    }
  }

  handleTuto();

  const token = localStorage.getItem('token');
  const location = useLocation();
  const categoriaId = location.pathname.split("/")[3];

  const [productos, setProductos] = useState([]);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [categoria, setCategoria] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState(1);

  useEffect(() => {
    console.log(token);
    console.log(categoriaId);

    const fetchData = async () => {
      try {
        const [productosRes, categoriaRes] = await Promise.all([
          API.get(`/api/tienda/productos/categoria/${categoriaId}`),
          API.get(`/api/tienda/categorias/${categoriaId}`),
        ]);
        setProductos(productosRes.data);
        setCategoria(categoriaRes.data);
      } catch (error) {
        console.log(error);
      }
      setIsDataUpdated(false);
    };
    fetchData();
  }, [isDataUpdated, categoriaId]);

  const [productoSubir, setProductoSubir] = useState({
    id_categoria: categoriaId,
    nombre: '',
    descripcion: '',
    precio: '',
    puntos: '',
    imagen: null
  });

  const handleChange = (e) => {
    setProductoSubir({
      ...productoSubir,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    setProductoSubir({
      ...productoSubir,
      imagen: e.target.files[0]
    })
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let nombre = productoSubir.nombre;
    let nombreConGuiones = nombre.replace(/\s+/g, '_');
    const id_unico = `producto_${nombreConGuiones}_${uniqid()}`;

    try {
      const productoData = {
        id: id_unico,
        nombre: productoSubir.nombre,
        descripcion: productoSubir.descripcion,
        precio: productoSubir.precio,
        puntos: productoSubir.puntos,
        id_categoria: productoSubir.id_categoria,
        foto: ''
      };

      const res = await API.post(`/api/tienda/productos/crear`, productoData);

      if (res.status === 200) {
        const formData = new FormData();
        formData.append('foto', productoSubir.imagen);
        formData.append('upload_preset', 'productos');
        formData.append('public_id', id_unico);

        const cloudinaryResponse = await API.post(`/api/imagenes/subir`, formData);
        const url = cloudinaryResponse.data.url;

        // Actualizar el producto en la base de datos con la URL de la imagen
        await API.put(`/api/tienda/productos/actualizar/${id_unico}`, {
          foto: url
        });

        Swal.fire({
          icon: 'success',
          title: res.data.message,
        });

        // Limpiar el formulario y actualizar el estado
        setProductoSubir({
          nombre: '',
          descripcion: '',
          precio: '',
          puntos: '',
          imagen: null,
          id_categoria: productoSubir.id_categoria
        });
        setIsDataUpdated(true);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: error.response.data.message
      });
    }

    // Cerrar el modal
    const modalElement = document.getElementById('AñadirModal');
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    resetFoto();
  };

  //useREf para limpiar el input de la imagen 
  const fileInputRef = useRef(null);

  //Función para resetear el input dela imagen
  const resetFoto = () => {
    fileInputRef.current.value = '';
  }

  const [editarProducto, setEditarProducto] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    puntos: '',
    imagen: null,
    id_categoria: categoriaId
  });


  const handleChangeEdit = (e) => {
    setEditarProducto(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChangeEdit = (e) => {
    setEditarProducto({ ...editarProducto, imagen: e.target.files[0] })
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  }

  const handleSubmitEdit = async (id) => {
    try {
      const productoData = {
        id: editarProducto.id,
        nombre: editarProducto.nombre,
        descripcion: editarProducto.descripcion,
        precio: editarProducto.precio,
        puntos: editarProducto.puntos,
        id_categoria: editarProducto.id_categoria
      }
      const res = await API.put(`/api/tienda/productos/actualizar/${id}`, productoData);
      if (res.status === 200) {
        try {
          if (imagePreview) {
            const formData = new FormData();
            formData.append('foto', editarProducto.imagen);
            formData.append('upload_preset', 'productos');
            formData.append('public_id', id);
            const cloudinaryResponse = await API.post(`/api/imagenes/subir`, formData);
            const url = cloudinaryResponse.data.url;
            const res2 = await API.put(`/api/tienda/productos/actualizar/${id}`, {
              foto: url
            });
            if (res2.status === 200) {
              Swal.fire({
                icon: 'success',
                title: res2.data.message,
              });
              const modalElement = document.getElementById('EditarModal');
              let modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance.hide();
              setImagePreview("");
              setIsDataUpdated(true);
            }
          }
          else {
            Swal.fire({
              icon: 'success',
              title: res.data.message,
            });
            const modalElement = document.getElementById('EditarModal');
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
      Swal.fire('Error', error.response.data, 'error');
    }
  }

  // Función para restaurar un producto
  const restaurarProducto = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: '¿Estás seguro de que desea restaurar este producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, restaurar'
      });

      if (!confirm.isConfirmed) {
        return;
      }

      const res = await API.put(`/api/tienda/productos/restaurar/${id}`);
      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: res.data.message
        });
        setIsDataUpdated(true);
      }
    } catch (error) {
      console.error('Error al restaurar producto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al restaurar producto',
        text: error.response.data.message
      });
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: '¿Estás seguro de eliminar este producto?',
        text: "No podrás revertir esta operación",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
      });
      if (confirm.isConfirmed) {
        const res = await API.put(`/api/tienda/productos/eliminar/${id}`);
        if (res.status === 200) {
          Swal.fire({
            icon: 'success',
            title: res.data.message
          });
          setIsDataUpdated(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  function openEditModal(producto) {
    setEditarProducto({
      id: producto.id_producto,
      nombre: producto.pro_nom,
      descripcion: producto.pro_desp,
      precio: producto.pro_precio,
      puntos: producto.pro_puntos,
      imagen: producto.pro_foto
    });
  }

  function filtrarProductosPorEstado(estado) {
    setEstadoFiltro(estado);
  }

  const productosFiltrados = productos
    .filter(producto => {
      return estadoFiltro === null || producto.pro_estado === estadoFiltro;
    });

  const handleClear = () => {
    setIsDataUpdated(true);
    setProductoSubir({
      nombre: '',
      descripcion: '',
      precio: '',
      puntos: '',
      imagen: null,
      id_categoria: categoriaId
    });
    setImagePreview('');
  };

  return (
    <div className="justify-content-between">
      <div className="d-flex justify-content-between mb-5">
        <h1>{categoria?.cat_nom}</h1>

        <div className="d-flex align-items-center">
          <div className="col me-5">
            {/* Dropdown para filtrar por estado */}
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" id='buttonEstado' type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Estado
              </button>
              <ul className="dropdown-menu">
                <li id='activos'>
                  <button className='btn w-100' onClick={() => filtrarProductosPorEstado(1)}>Activos</button>
                </li>
                <li id='inactivos'>
                  <button className='btn w-100' onClick={() => filtrarProductosPorEstado(0)}>Inactivos</button>
                </li>
                <li id='todos'>
                  <button className='btn w-100' onClick={() => filtrarProductosPorEstado(null)}>Todos</button>
                </li>
              </ul>
            </div>
          </div>
          <button id='crearProducto' type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#AñadirModal">
            <i className="bi bi-plus-circle"></i> Añadir producto
          </button>
        </div>

      </div>
      {/* Modal para añadir */}
      <div className="modal fade" id="AñadirModal" tabIndex="-1" aria-labelledby="MenuModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="MenuModalLabel">Agregar producto</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row p-3">
                  <div className="col-12">
                    <img height={200} width={200} src={imagePreview || img} className="rounded mx-auto d-block w-50 border" alt="..." />
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="floatingInput">Imagen</label>
                    <input ref={fileInputRef} onChange={handleFileChange} className='form-control' type="file" accept='image/*' id='imagen' name='imagen' required />
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="floatingInput">Nombre</label>
                    <input pattern="^[A-Za-zÁ-ÿÑñ\s]+$" value={productoSubir.nombre} onChange={handleChange} className='form-control' type="text" autoComplete='off' id='nombre' name='nombre' required />
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="floatingInput">Descripción</label>
                    <input value={productoSubir.descripcion} onChange={handleChange} className='form-control' type="text" autoComplete='off' id='descripcion' name='descripcion' required />
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="floatingInput">Precio</label>
                    <input value={productoSubir.precio} onChange={handleChange} className='form-control' type="number" autoComplete='off' id='precio' name='precio' required min={0} step={50} />
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="floatingInput">Puntos</label>
                    <input value={productoSubir.puntos} onChange={handleChange} className='form-control' type="number" autoComplete='off' id='puntos' name='puntos' required min={0} step={1} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleClear}>Cancelar</button>
                <button type="submit" className="btn btn-success">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4" id='verCategorias'>
        {productosFiltrados.map((producto) => (
          <div className="col my-2" key={producto.id_producto}>
            <div className="card text-center position-relative">
              <img src={`${producto.pro_foto}`} className="card-img-top border-bottom" height={200} width={200} style={{ objectFit: 'cover' }} alt="..." />
              <div className="card-body">
                <span id='estadoProducto' className={producto.pro_estado === 1 ? `position-absolute top-50 start-50 translate-middle-x badge rounded-pill bg-success` : `position-absolute top-50 start-50 translate-middle-x badge rounded-pill bg-danger`}>
                  {producto.pro_estado === 1 ? `Activo` : `Inactivo`}
                  <span className="visually-hidden">unread messages</span>
                </span>

                <h3 className="card-title mb-3">{producto.pro_nom}</h3>
                <div className="row">
                  <div className="col">
                    <NumericFormat value={producto.pro_precio} displayType={'text'} thousandSeparator='.' decimalSeparator=',' prefix={'$ '} />
                  </div>
                </div>

                <div className="row row-cols-3 mt-3">
                  {/* Botón para ver */}
                  <div className="col">
                    <Link to={`/admin/producto/${producto.id_producto}`} className="btn btn-success w-100" id='buttonVer'><i className="bi bi-eye"></i></Link>
                  </div>
                  {/* Botón para editar */}
                  <div className="col" id='buttonEditar'>
                    <button type="button" className="btn btn-warning w-100" data-bs-toggle="modal" data-bs-target="#EditarModal" onClick={() => openEditModal(producto)}><i className="bi bi-pencil-square"></i></button>
                  </div>
                  {/* Botón para eliminar/restaurar */}
                  <div className="col" id='buttonEliminar'>
                    <button className={producto.pro_estado === 1 ? `btn btn-danger w-100` : `btn btn-success w-100`} onClick={producto.pro_estado === 1 ?
                      () => eliminarProducto(producto.id_producto) : () => restaurarProducto(producto.id_producto)}>
                      <i className={producto.pro_estado === 1 ? `bi bi-trash` : `bi bi-arrow-counterclockwise`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Modal para editar */}
        <div className="modal fade" id="EditarModal" tabIndex="-1" aria-labelledby="MenuModalLabelEditar" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="MenuModalLabelEditar">Editar producto</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form onSubmit={handleSubmitEdit}>
                <div className="modal-body">
                  <div className="row p-3">
                    <div className="col-12 mb-3">
                      {editarProducto.imagen ? (
                        <img src={imagePreview ? imagePreview : `${editarProducto.imagen}`} className="rounded mx-auto mb-4 d-block w-50" alt="Imagen actual" />
                      ) : null}
                      <input onChange={handleFileChangeEdit} className='form-control' type="file" accept='image/*' id='imagen' name='imagen' />
                    </div>

                    <div className="col-12 mb-3">
                      <label htmlFor="floatingInput">Nombre</label>
                      <input pattern="^[A-Za-zÁ-ÿÑñ\s]+$" onChange={handleChangeEdit} value={editarProducto.nombre} className='form-control' type="text" autoComplete='off' id='nombre' name='nombre' required />
                    </div>
                    <div className="col-12 mb-3">
                      <label htmlFor="floatingInput">Descripción</label>
                      <input onChange={handleChangeEdit} value={editarProducto.descripcion} className='form-control' type="text" autoComplete='off' id='descripcion' name='descripcion' required />
                    </div>
                    <div className="col-12 mb-3">
                      <label htmlFor="floatingInput">Precio</label>
                      <input onChange={handleChangeEdit} value={editarProducto.precio} className='form-control' type="number" autoComplete='off' id='precio' name='precio' required min={0} step={50} />
                    </div>
                    <div className="col-12 mb-3">
                      <label htmlFor="floatingInput">Puntos</label>
                      <input onChange={handleChangeEdit} value={editarProducto.puntos} className='form-control' type="number" autoComplete='off' id='puntos' name='puntos' required min={0} step={1} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                  <button type="button" className="btn btn-success" onClick={() => handleSubmitEdit(editarProducto.id)}>Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
