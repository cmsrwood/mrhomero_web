import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios'
import img from '../../assets/img/img.png'
import moment from 'moment';
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4400";

export default function PerfilCliente() {

  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const token = localStorage.getItem('token');
  const id_user = JSON.parse(atob(token.split(".")[1])).id;
  const rol = JSON.parse(atob(token.split(".")[1])).rol;
  const [imagePreview, setImagePreview] = useState("");

  const [compras, setCompras] = useState([]);

  const [editarUser, setEditarUser] = useState({
    user_nom: '',
    user_apels: '',
    user_tel: null,
    user_foto: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, comprasRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/personas/clientes/${id_user}`),
          axios.get(`${BACKEND_URL}/api/tienda/ventas/cliente/${id_user}`),
        ]);
        setEditarUser(userRes.data);
        setCompras(comprasRes.data);
      } catch (error) {
        console.log(error);
      }
      setIsDataUpdated(false);
    };
    fetchData();
  }, [isDataUpdated, id_user]);

  const handleInputChangeEdit = (e) => {
    setEditarUser({ ...editarUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setEditarUser({ ...editarUser, user_foto: selectedFile }); (selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const fileInputRef = useRef(null);

  function resetFoto() {
    fileInputRef.current.value = '';
  }

  const handleEdit = async (e, id) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${BACKEND_URL}/api/personas/clientes/actualizar/${id}`, editarUser);
      if (res.status === 200) {
        if (imagePreview) {
          const formData = new FormData();
          formData.append('foto', editarUser.user_foto);
          formData.append('upload_preset', 'usuarios');
          formData.append('public_id', id);
          const cloudinaryResponse = await axios.post(`${BACKEND_URL}/api/imagenes/subir`, formData);
          const url = cloudinaryResponse.data.url;
          const res2 = await axios.put(`${BACKEND_URL}/api/personas/clientes/actualizar/${id}`, { foto: url });
          if (res2.status === 200) {
            Swal.fire({
              icon: 'success',
              title: "Tu perfil se ha actualizado correctamente"
            });
            setImagePreview("");
            setIsDataUpdated(true);
          }
        }
        else {
          Swal.fire({
            icon: 'success',
            title: "Tu perfil se ha actualizado correctamente"
          });
          setImagePreview("");
          setIsDataUpdated(true);
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire(error.res.data.message);
    }
    resetFoto();
  }

  return (
    <div className='mb-5'>
      <div className="px-5 container">
        <h1 className='text-center'>Tu perfil</h1>
        <form onSubmit={(e) => handleEdit(e, editarUser.id_user)}>
          <div className='align-items-center text-center pb-3 pt-3'>
            <p>Cambia tu foto de perfil</p>
            <img src={imagePreview ? imagePreview : editarUser.user_foto ? editarUser.user_foto : img} height={300} width={300} alt="" className='rounded mb-3' />
            <p>{imagePreview ? '¡Tu siguiente foto!' : '¡Tu foto actual!'}</p>
            <input ref={fileInputRef} onChange={handleFileChange} className='form-control mb-5' type="file" accept='image/*' id='imagen' name='imagen' />
            <h1>{editarUser.user_nom} {editarUser.user_apels}</h1>
            <h6 className='pb-4'>{`¡Estas registrado desde ${moment(editarUser.user_fecha_registro).format('DD/MM/YYYY')}!`}</h6>
            <div className={rol == 3 ? "row" : "row d-none"}>
              <div className="col-6">
                <h2>Compras realizadas</h2>
                <h3>{compras.length}</h3>
              </div>
              <div className="col-6">
                <h2>Puntos acumulados</h2>
                <h3>{editarUser.user_puntos}</h3>
              </div>
            </div>
            <hr className='border border-3' />
          </div>
          <div className='fs-5' key={editarUser.id_user}>
            <h1> Información personal</h1>
            <hr className='border border-3' />
            <div className="row cols-2">
              <div className="col-6">
                <label className='form-label'>Nombre</label>
                <input type="text" pattern="^[A-Za-zÁ-ÿÑñ\s]+$" className="form-control" onChange={handleInputChangeEdit} name="user_nom" value={editarUser.user_nom} required />
              </div>
              <div className="col-6">
                <label className='form-label '>Apellidos</label>
                <input type="text" pattern="^[A-Za-zÁ-ÿÑñ\s]+$" className="form-control" onChange={handleInputChangeEdit} name="user_apels" value={editarUser.user_apels} required />
              </div>
              <div className="col-6 mt-2">
                <label className='form-label '>Email</label>
                <input type="text" pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$' className="form-control" disabled value={editarUser.user_email} required />
              </div>
              <div className="col-6 mt-2">
                <label className='form-label'>Telefono</label>
                <input type="text" pattern='[0-9]{10}' className="form-control" onChange={handleInputChangeEdit} name="user_tel" value={editarUser.user_tel ? editarUser.user_tel : ""} required />
              </div>
              <button type="submit" className="btn btn-warning w-100 mt-3">
                <i className="bi bi-pencil-square"></i> Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}