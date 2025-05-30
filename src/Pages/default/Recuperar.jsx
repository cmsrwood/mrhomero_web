import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import NavegacionDefault from '../../navigation/NavegacionDefault';
import '../../styles/recuperar.css';
import API from '../../config/Api';

export default function Ingresar() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        newPassword: "",
        confirmPassword: "",
        verificationCode: ""
    });

    const email = localStorage.getItem("email");
    if (!email) {
        navigate("/ingresar");
    }

    const [code, setCode] = useState(new Array(6).fill(''));
    const inputRefs = useRef([]);

    const handleChange = (event) => {
        setUser(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const codeInput = (event, index) => {
        const { value } = event.target;
        const newCode = [...code];

        if (/^[0-9]$/.test(value) || value === "") {
            newCode[index] = value;
            setCode(newCode);

            if (value !== '') {
                // Mueve al siguiente campo si existe un numero en el input
                if (inputRefs.current[index + 1]) {
                    inputRefs.current[index + 1].focus();
                }
            } else {
                // Retrosede al anterior campo si el input es vacío
                if (inputRefs.current[index - 1]) {
                    inputRefs.current[index - 1].focus();
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        try {
            const res = await API.post(`/api/auth/resetPassword`, {
                ...user,
                verificationCode,
                email
            });
            if (res.status === 200) {
                Swal.fire({
                    title: 'Contraseña restaurada',
                    icon: 'success',
                    confirmButtonText: 'Continuar'
                });
                navigate("/ingresar");
                localStorage.removeItem("email");
            }
        } catch (error) {
            console.log(error);
            if (error.response) {
                Swal.fire({
                    title: error.response.data || 'Algo salió mal',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo'
                });
            }
        }
    };

    return (
        <div>
            <div className='container-fluid p-5 my-5 text-center wipe-in-down' transition-style="in:wipe:up" style={{ width: '85%', boxShadow: '0 0 15px 0 rgba(0, 0, 0, 0.3)' }}>
                <div className="row d-flex justify-content-center">
                    <div className="col-12 col-sm-5 align-content-center align-items-center p-5" style={{ boxShadow: '0 0 10px 0 rgb(0, 0, 0, 0.2)' }}>
                        <form onSubmit={handleSubmit}>
                            <i className='display-1 bi bi-person-circle'></i>
                            <div className="form-floating my-5">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Contraseña"
                                    name='newPassword'
                                    onChange={handleChange}
                                />
                                <label htmlFor="floatingInput">Contraseña nueva</label>
                            </div>
                            <div className="form-floating my-5">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Confirmar Contraseña"
                                    name='confirmPassword'
                                    onChange={handleChange}
                                />
                                <label htmlFor="floatingInput">Confirmar contraseña</label>
                            </div>
                            <div className="container-recuperar">
                                {Array.from({ length: 6 }, (_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="inp"
                                        maxLength={1}
                                        value={code[index]}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        onChange={(e) => codeInput(e, index)}
                                    />
                                ))}
                            </div>
                            <button className="btn btn-warning w-100 rounded-5 mb-2 py-2" type="submit">Recuperar contraseña</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
