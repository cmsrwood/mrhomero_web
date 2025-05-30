import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import logo from '/logo.png'
import API from '../../config/Api';
export default function Registrar() {

  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState(false);

  const [user, setUser] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    confirmPassword: ""

  });

  const handleChange = (e) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit = async (e) => {
    setIsUploading(true);
    e.preventDefault();
    const nombre = user.nombres;
    const nombreConGuiones = nombre.replace(/\s+/g, '_');
    const id_unico = `user_${nombreConGuiones}_${Date.now()}`
    try {
      const data = {
        id: id_unico,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword
      }
      const res = await API.post(`/api/auth/registrar`, data);
      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: res.data.message,
          confirmButtonText: 'Continuar'
        });
        console.log(res);
        navigate("/ingresar");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: error.response.data.message,
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="vh-100 container ">
      <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-2 ">
        <div className='col'>
          <form onSubmit={handleSubmit} className='px-0 px-sm-5 py-2'>
            <div className='text-center my-3'>
              <h1 className='text-warning'>Registro</h1>
              <p>Crear una cuenta</p>
            </div>
            <div className="form-floating mb-3">
              <input pattern="^[A-Za-zÁ-ÿÑñ\s]+$" type="text" className="form-control " id="floatingInput" placeholder="nombres" name='nombres' onChange={handleChange} required />
              <label htmlFor="floatingInput">Nombres</label>
            </div>
            <div className="form-floating mb-3">
              <input pattern="^[A-Za-zÁ-ÿÑñ\s]+$" type="text" className="form-control " id="floatingInput" placeholder="apellidos" name="apellidos" onChange={handleChange} required />
              <label htmlFor="floatingInput">Apellidos</label>
            </div>
            <div className="form-floating mb-3">
              <input type="email" className="form-control" id="floatingInput" placeholder="email" name='email' onChange={handleChange} required />
              <label htmlFor="floatingInput">Email</label>
            </div>
            <div className="form-floating mb-3">
              <input type="password" className="form-control" id="floatingInput" placeholder="Contraseña" name='password' onChange={handleChange} required />
              <label htmlFor="floatingInput">Contraseña</label>
            </div>
            <div className="form-floating mb-3">
              <input type="password" className="form-control" id="floatingInput" placeholder="Confirmar contraseña" name='confirmPassword' onChange={handleChange} required />
              <label htmlFor="floatingInput">Confirmar contraseña</label>
            </div>
            <div className="text-center">
              <button className="btn btn-warning w-100 rounded-5 mb-2 py-2" type='submit'>
                {isUploading ?
                  <div className="spinner-border text-dark" style={{ width: '1.5rem', height: '1.5rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  :
                  'Registrar'}</button>
              <p><small> Al registrarte, aceptas nuestras <Link to='/condiciones-de-uso' >Condiciones de uso</Link> y <Link to='/politica-de-privacidad'>Politica de privacidad</Link> </small></p>
              <p className="text-center text-secondary"><small> ¿Ya tienes una cuenta? <Link to="/ingresar">Inicia sesion</Link> </small></p>
            </div>
          </form>
        </div>
        <div className='col pt-5'>
          <div className='px-0 px-sm-5 pt-5 text-center'>
            <img className='img-fluid w-50' src={logo} alt="logo" />
            <h1 className='mt-3'>¡Bienvenido!</h1>
            <p>Registrate y disfruta de nuestros servicios</p>
          </div>
        </div>
      </div>
    </div>
    // pattern="^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$"
  )
}
