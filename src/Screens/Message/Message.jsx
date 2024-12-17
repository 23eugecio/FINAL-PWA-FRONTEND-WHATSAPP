import React, { useState, useEffect } from 'react';
import { POST } from '../utils/http.fetching'; // Adapta la importación según tu estructura
import ENVIRONMENT from '../environment'; // Adapta la importación

// Interfaz para los usuarios (ajusta según tu backend)
interface User {
    id: string;
    name: string;
    email: string;
}

const MessageCreate = () => {
    // Estado para manejar la lista de usuarios
    const [users, setUsers] = useState<User>([]);
    
    // Estado para el formulario de mensaje
    const [formData, setFormData] = useState({
        receiver_id: '',
        content: ''
    });

    // Estado para manejar mensajes y errores
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Cargar lista de usuarios al montar el componente
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await POST(`${ENVIRONMENT.URL_BACK}/api/users`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
                    }
                });

                if (response.ok) {
                    setUsers(response.data.users);
                }
            } catch (err) {
                setError('No se pudieron cargar los usuarios');
            }
        };

        fetchUsers();
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Enviar mensaje
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const response = await POST(`${ENVIRONMENT.URL_BACK}/api/messages`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage('Mensaje enviado exitosamente');
                // Limpiar formulario
                setFormData({
                    receiver_id: '',
                    content: ''
                });
            } else {
                setError(response.message || 'Error al enviar el mensaje');
            }
        } catch (err) {
            setError('No se pudo enviar el mensaje');
        }
    };

    return (
        <div className="message-create-container">
            <h2>Enviar Nuevo Mensaje</h2>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="message-form">
                <div className="form-group">
                    <label htmlFor="receiver_id">Destinatario:</label>
                    <select
                        id="receiver_id"
                        name="receiver_id"
                        value={formData.receiver_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona un destinatario</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="content">Mensaje:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Escribe tu mensaje..."
                        required
                        minLength={1}
                        maxLength={500}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={!formData.receiver_id || !formData.content}
                >
                    Enviar Mensaje
                </button>
            </form>
        </div>
    );
};

export default MessageCreate;