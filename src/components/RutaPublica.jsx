import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from '../components/Loader';
import API from '../config/Api';

export default function RutaPublica() {
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const rolToken = async () => {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                };
                const res = await API.get(`/api/auth/validarToken`, config);
                setUserRole(res.data.rol);
            } catch (err) {
                console.error(err);
                localStorage.removeItem('token');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Su sesión ha expirado. Por favor, inicia sesión de nuevo.',
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            rolToken();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    if (isLoading) {
        return <Loader />;
    }

    if (userRole) {
        switch (userRole) {
            case 1:
                return <Navigate to="/admin/" />;
            case 2:
                return <Navigate to="/empleado/pedidos" />;
            case 3:
                return <Navigate to="/cliente/" />;
            default:
                return <Navigate to="/ingresar/" />;
        }
    }

    return <Outlet />;
}
