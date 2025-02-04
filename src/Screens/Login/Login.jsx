import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { POST } from '../../Fetching/http.fetching';

import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuthContext();
    const [error, setError] = useState(null);

    const handleSubmitLoginForm = async (e) => {
        e.preventDefault();
        setError(null);

        const form_HTML = e.target;
        const form_Values = new FormData(form_HTML);
        const form_fields = {
            email: form_Values.get('email'),
            password: form_Values.get('password'),
        };

        try {
            const data = await POST('/api/auth/login', form_fields); // Utilizando la función POST mejorada

            const { token, user } = data.payload;
            sessionStorage.setItem('user_info', JSON.stringify(user));
            await login(user._id, token);
            navigate('/contact-home', { replace: true });
        } catch (error) {
            console.error('Error during login:', error);
            setError(error.message || 'An unexpected error occurred');
        }
    };

    return (
        <div className="login-container">
            <h1>Login!</h1>
            {error && (
                <div className="error-modal">
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>Close</button>
                </div>
            )}
            <form onSubmit={handleSubmitLoginForm}>
                <div>
                    <label htmlFor="email">Enter your Email:</label>
                    <input
                        name="email"
                        id="email"
                        placeholder="john@gmail.com"
                        type="email"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Enter your Password:</label>
                    <input
                        name="password"
                        id="password"
                        placeholder="Password"
                        type="password"
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
