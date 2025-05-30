import React, { useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import Swal from 'sweetalert2'
import API from '../../config/Api';
export default function Horas() {

  const [horas, setHoras] = useState([]);
  const [isDataUpdated, setDataUpdated] = useState(false);

  const token = localStorage.getItem('token');
  const id = JSON.parse(atob(token.split(".")[1])).id;
  const mes = moment().format('M');
  const ano = moment().format('YYYY');
  const fecha = moment().format('YYYY-MM-DD');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [horasRes] = await Promise.all([
          API.get(`/api/personas/empleados/horasDia/${id}/${fecha}`),
        ]);
        setHoras(horasRes.data);
      } catch (error) {
        console.log(error);
      }
      setDataUpdated(false);
    };
    fetchData();
  }, [isDataUpdated, id, fecha]);

  const agregarHoraInicio = async () => {
    const hora_inicio = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
      await API.post(`/api/personas/empleados/horaInicio/${id}`, { hora_inicio, fecha });
      Swal.fire({
        icon: 'success',
        title: 'Hora de turno en progreso...',
        showConfirmButton: false,
        timer: 1500
      })
      setDataUpdated(true);
    } catch (error) {
      console.log(error);
    }
  };
  const agregarHoraFin = async () => {
    const hora_fin = moment().format('YYYY-MM-DD HH:mm:ss');
    try {
      await API.post(`/api/personas/empleados/horaFin/${id}`, { hora_fin, fecha });
      Swal.fire({
        icon: 'success',
        title: 'Turno registrado, gracias por trabajar con nosotros.',
        showConfirmButton: false,
        timer: 1500
      })
      setDataUpdated(true);
    } catch (error) {
      console.log(error);
    }
  };

  function mesANombre(mes) {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[mes - 1];
  }

  return (
    <div>
      <h1>Control de tiempo</h1>
      {horas.length === 0 ?
        <div>
          <h3 className='text-center py-3'>No hay horas registradas hoy</h3>
          <button onClick={agregarHoraInicio} type='submit' className='btn btn-success mx-3 w-25 d-block mx-auto'>Iniciar turno</button>
        </div>
        :
        <div>
          {horas.hora_fin === null ?
            <div>
              <div className="card w-75 mx-auto mt-4">
                <div className="card-header">
                  <span>Fecha: {moment().format('DD')} de {mesANombre(moment().format('M'))} del {moment().format('YYYY')}</span>
                </div>
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div className="row">
                    <div className="col-12">
                      <h5 className="card-title pb-2">Hora de inicio: {moment(horas.hora_inicio).format('HH:mm:ss')}</h5>
                      <h5>Hora de fin: Trabajando...</h5>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <button onClick={agregarHoraFin} type='submit' className='btn btn-danger d-block mx-auto'>Terminar turno</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            <div>
              <div className="card w-75 mx-auto mt-4">
                <div className="card-header">
                  <span>Fecha: {moment().format('DD')} de {mesANombre(moment().format('M'))} del {moment().format('YYYY')}</span>
                </div>
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div className="">
                    <h5 className="card-title pb-2">Hora de inicio: {moment(horas.hora_inicio).format('HH:mm:ss')}</h5>
                  </div>
                  <div className="">
                    <h5>Hora de fin: {moment(horas.hora_fin).format('HH:mm:ss')}</h5>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  )
}
