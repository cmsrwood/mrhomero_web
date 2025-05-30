import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { driver } from 'driver.js';
import "driver.js/dist/driver.css";
import API from '../../config/Api';

export default function HorasEmpleados() {

  const driverObj = driver({
    showProgress: true,
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Finalizar',
    steps: [
      {
        element: '#empleados',
        popover: {
          title: 'Visualizar empleados',
          description: 'Aqui podras ver todos los empleados',
          side: "right",
          align: 'center'
        }
      },
      {
        element: '#fotosEmpleados',
        popover: {
          title: 'Foto de empleado',
          description: 'Aqui podras ver la foto del empleado',
          side: "right",
          align: 'center'
        }
      },
      {
        element: '#informacionEmpleados',
        popover: {
          title: 'Informacion de empleados',
          description: 'Aqui podras ver el nombre y el numero celular de cada empleado',
          side: "right",
          align: 'center'
        }
      },
      {
        element: '#buttonHoras',
        popover: {
          title: 'Horas de empleados',
          description: 'Este boton te lleva al registro de horas trabajadas de cada empleado',
          side: "right",
          align: 'center',
          onNextClick: () => {
            document.querySelector('#buttonHoras')?.click();
            setTimeout(() => {
              driverObj.moveNext();
            }, 200);
          }
        }
      }
    ]
  })

  const handleTuto = async () => {
    if (localStorage.getItem('needHorasEmpleadosTuto') == null) {
      driverObj.drive();
      localStorage.setItem('needHorasEmpleadosTuto', false);
    }
    else if (localStorage.getItem('needHorasEmpleadosTuto') == true) {
      driverObj.drive();
    }
  }

  const activateTuto = () => {
    driverObj.drive();
  }

  handleTuto();


  const [empleados, setEmpleados] = useState([])
  const [isDataUpdated, setIsDataUpdated] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empleadosRes] = await Promise.all([
          API.get(`/api/personas/empleados/`),
        ]);
        setEmpleados(empleadosRes.data);
      } catch (error) {
        console.log(error);
      }
      setIsDataUpdated(false);
    };
    fetchData();
  }, [isDataUpdated]);



  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 " id="empleados">
      {empleados.map((empleado) => (
        <div className="col card text-center p-2" key={empleado.id_user}>
          <img src={`${empleado.user_foto}`} height={200} className="card-img-top" alt="..." id='fotosEmpleados' />
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center" id='informacionEmpleados'>
              <h3 className="card-title" >{empleado.user_nom} {empleado.user_apels}</h3>
              <h3 className="card-title" >{empleado.user_tel}</h3>
            </div>

          </div>
          <Link to={`/admin/gestionhoras/${empleado.id_user}`} type="button" className="btn btn-warning ms-2" id='buttonHoras'><i className="bi bi-info-circle"></i> Información</Link>
        </div>
      ))}
      <a href="#" className='text-end text-secondary text-decoration-none'><small className='' onClick={() => { activateTuto() }}>Ver tutorial nuevamente</small></a>
    </div>

  )


}
