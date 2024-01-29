import React, { useState, useEffect } from 'react';
import { getCookiesByName } from '../utils/formsUtils.js';

const ProfileImg = () => {
    const [file, setFile] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        setUserId(obtenerUserId());
    }, []);

    const obtenerUserId = () => {
        const token = getCookiesByName('jwtCookie');

        if (token && token._id) {
            return token._id;
        }

        return null;
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (file && userId) {
            const formData = new FormData();
            formData.append('profileImage', file);

            const uploadUrl = `http://localhost:8080/api/users/upload/profile/${userId}`;

            fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Respuesta del servidor:', data);
                })
                .catch(error => {
                    console.error('Error al subir el archivo:', error);
                    return error.text();
                })
                .then(errorMessage => {
                    console.log('Respuesta del servidor (error):', errorMessage);
                });
        } else {
            console.warn('Ningún archivo seleccionado o ID de usuario no disponible.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" name="profileImage" onChange={handleFileChange} />
                <button type="submit">Subir Archivo</button>
            </form>
        </div>
    );
};

export default ProfileImg;
