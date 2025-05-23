import React, { useEffect, useState } from 'react'
import NavegacionAdmin from '../../navigation/NavegacionAdmin'
import Swal from 'sweetalert2'
import axios from 'axios';
import { driver } from 'driver.js'
import "driver.js/dist/driver.css"
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4400";
export default function Proveedores() {
    const driverObj = driver({
        showProgress: true,
        nextBtnText: 'Siguiente',
        prevBtnText: 'Atrás',
        doneBtnText: 'Terminar',
        steps: [
            {
                element: '#tablaProveedores',
                popover: {
                    title: 'Proveedores',
                    description: 'Aqui podras ver todos los proveedores.',
                    side: "right",
                    align: 'center'
                }
            },
            {
                element: '#buttonCrearProveedor',
                popover: {
                    title: 'Crear Proveedor',
                    description: 'Pulsa sobre el boton para crear un nuevo proveedor.',
                    side: "right",
                    align: 'center',
                    onNextClick: () => {
                        document.querySelector('#buttonCrearProveedor')?.click();
                        setTimeout(() => {
                            driverObj.moveNext();
                        }, 200);
                    }
                }
            },
            {
                element: '#formulario',
                popover: {
                    title: 'Crear Proveedor',
                    description: 'Aqui podras crear un nuevo proveedor, debes llenar todo el formulario.',
                    side: "right",
                    align: 'center'
                }
            },
            {
                element: '#crearProveedor',
                popover: {
                    title: 'Crear Proveedor',
                    description: 'Pulsa sobre el boton para crear el proveedor.',
                    side: "right",
                    align: 'center'
                }
            },
            {
                element: '#cerrarModal',
                popover: {
                    title: 'Cerrar Modal',
                    description: 'Pulsa sobre el boton para cerrar el modal.',
                    side: "right",
                    align: 'center',
                    onNextClick: () => {
                        document.querySelector('#cerrarModal')?.click();
                        setTimeout(() => {
                            driverObj.moveNext();
                        }, 200);
                    }
                }
            },
            {
                element: '#proveedor',
                popover: {
                    title: 'Proveedores',
                    description: 'Aqui podras ver toda la informacion de los proveedores.',
                    side: "right",
                    align: 'center'
                }
            },
            {
                element: '#telefono',
                popover: {
                    title: 'Telefono',
                    description: 'Aqui podras darle click al boton para llamar al proveedor o enviarle un mensaje.',
                    side: "right",
                    align: 'center'
                }
            },
            {
                element: '#editarProveedor',
                popover: {
                    title: 'Editar Proveedor',
                    description: 'Pulsa sobre el boton para editar el proveedor.',
                    side: "right",
                    align: 'center'
                }
            },
            {
                element: '#eliminarProveedor',
                popover: {
                    title: 'Eliminar Proveedor',
                    description: 'Pulsa sobre el boton para eliminar el proveedor.',
                    side: "right",
                    align: 'center'
                }
            }
        ]
    })

    const handleTuto = async () => {
        const tuto = localStorage.getItem('needProveedoresTuto');
        if (tuto == null) {
            driverObj.drive();
            localStorage.setItem('needProveedoresTuto', false);
        }
        else if (tuto == true) {
            driverObj.drive();
        }
    }

    handleTuto();

    const [proveedores, setProveedores] = useState([]);
    const [isDataUpdated, setIsDataUpdated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/api/tienda/proveedores/`);
                setProveedores(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
        setIsDataUpdated(false);
    }, [isDataUpdated]);

    // Para crear el proveedor
    const [proveedor, setProveedor] = useState({
        prov_nombre: '',
        prov_direccion: '',
        prov_contacto_nombre: '',
        prov_contacto_telefono: '',
        prov_contacto_email: ''
    });

    //Para editar el proveedor
    const [proveedorEdit, setProveedorEdit] = useState({
        prov_id: '',
        prov_nombre: '',
        prov_direccion: '',
        prov_contacto_nombre: '',
        prov_contacto_telefono: '',
        prov_contacto_email: ''
    });

    // handleSubmit para crear el proveedor
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BACKEND_URL}/api/tienda/proveedores/crear`, proveedor);
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: res.data.message
                });
                setIsDataUpdated(true);
                // Resetear el formulario a valores vacíos
                setProveedor({
                    prov_nombre: '',
                    prov_direccion: '',
                    prov_contacto_nombre: '',
                    prov_contacto_telefono: '',
                    prov_contacto_email: '',
                });
                // Cerrar el modal
                const modalElement = document.getElementById('ModalAñadirProv');
                let modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });
        }
    };

    // hanleChange para crear el proveedor
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProveedor(prev => ({ ...prev, [name]: value }));
    };

    // handleEdit para editar el proveedor
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setProveedorEdit(prev => ({ ...prev, [name]: value }));
    };

    // handleSubmit para editar el proveedor
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${BACKEND_URL}/api/tienda/proveedores/actualizar/${proveedorEdit.prov_id}`, proveedorEdit);
            if (res.status === 200) {
                setIsDataUpdated(true);
                Swal.fire({
                    icon: 'success',
                    title: res.data.message
                })
                // Cerrar el modal
                const modalElement = document.getElementById('ModalEditarProv');
                let modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message
            });
        }
    };

    const OpenEditModal = (proveedor) => {
        setProveedorEdit({
            prov_id: proveedor.id_proveedor,
            prov_nombre: proveedor.prov_nombre,
            prov_direccion: proveedor.prov_direccion,
            prov_contacto_nombre: proveedor.prov_contacto_nombre,
            prov_contacto_telefono: proveedor.prov_contacto_telefono,
            prov_contacto_email: proveedor.prov_contacto_email,
        });
    };

    const eliminar = async (id) => {
        try {
            const confirm = await Swal.fire({
                title: '¿Estas seguro de eliminar este proveedor?',
                text: "No podrás revertir esta acción",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar'
            });
            if (!confirm.isConfirmed) {
                return;
            }
            const res = await axios.delete(`${BACKEND_URL}/api/tienda/proveedores/eliminar/${id}`);
            if (res.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: res.data.message
                });
                setIsDataUpdated(true);
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message
            });
        }
    };


    return (
        <div className=''>
            <div className="d-flex justify-content-between m-3">
                <h1>Proveedores</h1>
                <button type="button" id='buttonCrearProveedor' className="btn btn-success" data-bs-toggle="modal" data-bs-target="#ModalAñadirProv"><i className="bi bi-plus"></i>añadir</button>
            </div>
            <div className="modal" id="ModalAñadirProv" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog  modal-fullscreen-sm-down">
                    <div className="modal-content">
                        <div className="modal-header" >
                            <h5 className="modal-title" id="exampleModalLabel">Añadir Proveedor</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" id='formulario'>

                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">Empresa:</label>
                                <input type="text" className="form-control" id="recipient-name" name="prov_nombre" onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">Dirección:</label>
                                <input type="text" className="form-control" id="recipient-name" name="prov_direccion" onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">Contacto:</label>
                                <input type="text" className="form-control" id="recipient-name" name="prov_contacto_nombre" onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">Telefono:</label>
                                <input type="text" className="form-control" id="recipient-name" name="prov_contacto_telefono" onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">Email:</label>
                                <input type="text" className="form-control" id="recipient-name" name="prov_contacto_email" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id='cerrarModal' className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" id='crearProveedor' className="btn btn-warning" onClick={handleSubmit}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

            <table className="table" id='tablaProveedores'>
                <thead>
                    <tr>
                        <th>id</th>
                        <th scope="col">Empresa</th>
                        <th scope="col">Dirección</th>
                        <th scope="col">Contacto</th>
                        <th scope="col">Telefono</th>
                        <th scope="col">Email</th>
                        <th scope="col">Editar</th>
                        <th scope='col'>Eliminar</th>
                    </tr>
                </thead>
                <tbody id='proveedor'>
                    {proveedores.map(proveedor => (
                        <tr key={proveedor.id_proveedor}>
                            <th>{proveedor.id_proveedor}</th>
                            <th scope="row" className="text-warning">{proveedor.prov_nombre}</th>
                            <td>{proveedor.prov_direccion}</td>
                            <td>{proveedor.prov_contacto_nombre}</td>
                            <td id='telefono'><a className='btn btn-success' href={`tel:${proveedor.prov_contacto_telefono}`}><i className='bi bi-telephone'></i> {proveedor.prov_contacto_telefono}</a></td>
                            <td>{proveedor.prov_contacto_email}</td>
                            <td><button className="btn btn-warning" id='editarProveedor' data-bs-toggle="modal" data-bs-target="#ModalEditarProv" onClick={() => { OpenEditModal(proveedor) }}><i className="bi bi-pencil-square"></i></button></td>
                            <td><button className="btn btn-danger" id='eliminarProveedor' onClick={() => { eliminar(proveedor.id_proveedor) }}><i className="bi bi-trash"></i></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Modal para Editar proveedor */}
            <div className="modal" id="ModalEditarProv" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog  modal-fullscreen-sm-down">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Editar Proveedor</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">Empresa:</label>
                                <input type="text" className="form-control" id="recipient-name" name="prov_nombre" value={proveedorEdit.prov_nombre} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">Dirección:</label>
                                <input type="text" className="form-control" id="recipient-name" name="prov_direccion" value={proveedorEdit.prov_direccion} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">Contacto:</label>
                                <input type="text" className="form-control" id="recipient-name" name="prov_contacto_nombre" value={proveedorEdit.prov_contacto_nombre} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">Telefono:</label>
                                <input type="text" className="form-control" id="recipient-name" name="prov_contacto_telefono" value={proveedorEdit.prov_contacto_telefono} onChange={handleEditChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">Email:</label>
                                <input type="text" className="form-control" id="recipient-name" name="prov_contacto_email" value={proveedorEdit.prov_contacto_email} onChange={handleEditChange} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-warning" onClick={handleEditSubmit}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
