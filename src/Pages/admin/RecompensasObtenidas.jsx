import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import moment from 'moment'
import { driver } from 'driver.js'
import "driver.js/dist/driver.css"
import API from '../../config/Api';

export default function RecompensasObtenidas() {
    const driverObj = driver({
        showProgress: true,
        nextBtnText: 'Siguiente',
        prevBtnText: 'Anterior',
        doneBtnText: 'Finalizar',
        steps: [
            {
                element: '#recompensasObtenidas',
                popover: {
                    title: 'Recompensas obtenidas',
                    description: 'En esta sección se muestran todas las recompensas obtenidas por los clientes.',
                },
            },
            {
                element: '#recompensa',
                popover: {
                    title: 'Recompensas',
                    description: 'En esta sección se muestra la recompensa a validar.',
                },
            },

            {
                element: '#validar',
                popover: {
                    title: 'Validar recompensa',
                    description: 'Usa el boton para validar la recompensa.',
                    onNextClick: () => {
                        document.querySelector('#validar')?.click();
                        setTimeout(() => {
                            driverObj.moveNext();
                        }, 200);
                    }
                },
            },
            {
                element: '#validarCodigo',
                popover: {
                    title: 'Validar codigo',
                    description: 'Ingresa el codigo para validar la recompensa.',
                    onNextClick: () => {
                        document.querySelector('#cerrar')?.click();
                        setTimeout(() => {
                            driverObj.moveNext();
                        }, 200);
                    }
                }
            },
            {
                element: '#tutorial',
                popover: {
                    title: 'Tutorial',
                    description: 'Pulsa sobre el boton para ver el tutorial.',
                }
            }
            
        ]
    });
    const handleTuto = async () => {
        const tuto = localStorage.getItem('needRecompensasObtenidasTuto');
        if (tuto == null) {
            driverObj.drive();
            localStorage.setItem('needRecompensasObtenidasTuto', false);
        }
        else if (tuto == true) {
            driverObj.drive();
        }
    };
    const activateTuto = () => { 
        driverObj.drive();
    }
    handleTuto();

    const [isDataUpdated, setIsDataUpdated] = useState(false);

    const [recompensas, setRecompensas] = useState([]);
    const [recompensasObtenidas, setRecompensasObtenidas] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [searchTerm, setSearchTerms] = useState('');

    const handleSearch = (e) => {
        setSearchTerms(e.target.value);
    }

    const recompensasObtenidasFiltradas = recompensasObtenidas
        .filter(recompensasObtenida => {
            const term = searchTerm.toLowerCase();
            return (
                recompensas.find(recompensa => recompensa.id_recomp === recompensasObtenida.id_recomp).recompensa_nombre.toLowerCase().includes(term) ||
                recompensas.find(recompensa => recompensa.id_recomp === recompensasObtenida.id_recomp).recompensa_descripcion.toLowerCase().includes(term) ||
                clientes.find(cliente => cliente.id_user === recompensasObtenida.id_user).user_nom.toLowerCase().includes(term) ||
                clientes.find(cliente => cliente.id_user === recompensasObtenida.id_user).user_apels.toLowerCase().includes(term) ||
                recompensasObtenida.fecha_reclamo.toString().includes(term)
            );
        }
        );

    const [recompensaAValidar, setRecompensaAValidar] = useState({
        id_recomp_obt: '',
        id_recomp: '',
        id_cliente: '',
        codigo: '',
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recompensasRes, recompensasObtenidasRes, clientesRes] = await Promise.all([
                    API.get(`/api/tienda/recompensas/`),
                    API.get(`/api/tienda/recompensas/recompensasObtenidas/recompensas`),
                    API.get(`/api/personas/clientes/`)
                ]);
                setRecompensas(recompensasRes.data);
                setRecompensasObtenidas(recompensasObtenidasRes.data);
                setClientes(clientesRes.data);
            } catch (error) {
                console.log(error);
            }
            setIsDataUpdated(false);
        };
        fetchData();
    }, [isDataUpdated]);

    const validarRecompensa = async (e, id_recomp_obt) => {
        e.preventDefault();
        try {
            const res = await API.put(`/api/tienda/recompensas/validar/${id_recomp_obt}`, recompensaAValidar);
            Swal.fire({
                title: res.data.title,
                text: res.data.message,
                icon: 'success'
            }).then(() => {
                const modalElement = document.getElementById(`modalValidar`);
                let modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();
            })
            setIsDataUpdated(true);
        } catch (err) {
            console.log(err);
            Swal.fire({
                title: err.response.data.title,
                text: err.response.data.message,
                icon: 'error',
                timer: 1000,
                showConfirmButton: false

            })
        }
    };

    const handleChange = (e) => {
        setRecompensaAValidar({
            ...recompensaAValidar,
            [e.target.name]: e.target.value
        })
    }

    function mostrarModal(recompensa_obtenida) {
        setRecompensaAValidar({
            id_recomp_obt: recompensa_obtenida.id_recomp_obt,
            id_recomp: recompensa_obtenida.id_recomp,
            id_cliente: recompensa_obtenida.id_user,
            codigo: '',
        })
    }

    return (
        <div className=''>
            <div className="input-group">
                <input
                    type="search"
                    className="form-control form-control-lg ps-5 w-100"
                    placeholder="Buscar recompensa..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <i className={`bi bi-search position-absolute top-50 translate-middle-y ms-3 text-secondary`}></i>
            </div>
            <div className="row mt-2 g-5 scrollbar">
                {recompensasObtenidasFiltradas.map((recompensaObtenida) => (
                    <div className="col-12 border my-2 p-5" id='recompensa' key={recompensaObtenida.id_recomp_obt}>
                        <div className="row align-items-center">
                            <div className="col-2">
                                <img src={`${recompensas.find(recompensa => recompensa.id_recomp == recompensaObtenida.id_recomp).recomp_foto}`} className='rounded border img-fluid w-100' alt="" />
                            </div>
                            <div className="col-6 px-5 align-content-center">
                                <h2>{recompensas.find(recompensa => recompensa.id_recomp == recompensaObtenida.id_recomp).recompensa_nombre}</h2>
                                <p>{recompensas.find(recompensa => recompensa.id_recomp == recompensaObtenida.id_recomp).recompensa_descripcion}</p>
                                <p className='text-warning'>{clientes.find(cliente => cliente.id_user == recompensaObtenida.id_user)?.user_nom} {clientes.find(cliente => cliente.id_user == recompensaObtenida.id_user)?.user_apels}</p>
                                <p className=''>{moment(recompensaObtenida.fecha_reclamo).format('DD/MM/YYYY HH:mm')}</p>
                            </div>
                            <div className={`col-4 text-center`}>
                                <button type="button" className="btn btn-warning" data-bs-toggle="modal" onClick={() => mostrarModal(recompensaObtenida)} data-bs-target={`#modalValidar`} id= 'validar'>
                                    Validar recompensa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Modal validar */}
            <div className="modal" id='modalValidar' tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" id='validarCodigo'>
                        <form onSubmit={(e) => validarRecompensa(e, recompensaAValidar.id_recomp_obt)}>
                            <div className="modal-body">
                                <h5 className="modal-title" id="exampleModalLabel">Validar recompensa</h5>
                                <div className="form-floating my-5">
                                    <input type="text" pattern='[0-9]{6}' value={recompensaAValidar.codigo} onChange={handleChange} className="form-control" placeholder="codigo" name='codigo' required />
                                    <label htmlFor="floatingInput">Codigo</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id= 'cerrar'>Close</button>
                                <button type="submit" className="btn btn-success">Validar recompensa</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-12 text-end mb-5" >
                <a href="#" className='text-end text-secondary text-decoration-none'><small id='tutorial' className='' onClick={() => { activateTuto() }}>Ver tutorial nuevamente</small></a>
            </div>
        </div>
    )
}
