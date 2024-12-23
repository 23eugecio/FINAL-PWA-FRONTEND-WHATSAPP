import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { extractFormData } from '../../utils/extractFormData.js';
import ENVIROMENT from '../../enviroment.js';
import './Login.css';
import { getAuthenticatedHeaders, POST } from '../../Fetching/http.fetching.js';

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const user = sessionStorage.getItem('user_id');
    const handleSubmitLoginForm = async (e) => {
        try {
            e.preventDefault();
            setError(null);

            const form_HTML = e.target;
            const form_Values = new FormData(form_HTML);
            const form_fields = {
                email: '',
                password: ''
            };
            const form_values_object = extractFormData(form_fields, form_Values);

            const response = await POST(
                `${ENVIROMENT.URL_BACK}/api/auth/login`,
                {
                    headers: getAuthenticatedHeaders(),
                    body: JSON.stringify(form_values_object),
                }
            );

            if (response && response.payload) {
                sessionStorage.setItem('access_token', response.payload.token);
                sessionStorage.setItem('user_info', JSON.stringify(response.payload.user));
                navigate('/contact-home');
            }
            else {
                setError('Invalid email or password.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError(error.message || 'An unexpected error occurred.');
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
                <span>
                    If you don't have an account yet?{' '}
                    <Link to="/register">Register!</Link>
                </span>
                <span>
                    Forgot your password?{' '}
                    <Link to="/forgot-password">Click here!</Link>
                </span>
            </form>
        </div>
    );
};

export default Login;