import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import ENVIRONMENT from '../../environment.js';
import useForm from '../../Hooks/useForm.jsx';
import { getUnnauthenticatedHeaders, POST } from '../../Fetching/http.fetching.js';
import extractFormData from '../../utils/extractFormData.js';
import { useState } from 'react';

const form_fields = {
    'name': '',
    'email': '',
    'password': ''
};

const Register = () => {
    const navigate = useNavigate(); 
    const [errorMessage, setErrorMessage] = useState('');
    const { form_values_state, handleChangeInputValue } = useForm(form_fields);

    const handleSubmitRegisterForm = async (e) => {

        setErrorMessage('');

        try {
            e.preventDefault();
            const form_HTML = e.target;
            const form_values = new FormData(form_HTML);
            const form_values_state = extractFormData(form_fields, form_values);

            const body = await POST(
                `${ENVIRONMENT.URL_BACK}/api/auth/register`,
                {
                    headers: getUnnauthenticatedHeaders(),
                    body: JSON.stringify(form_values_state)
                }
            );

            if (body && body.ok) {
                const access_token = body.payload.token;
                sessionStorage.setItem('access_token', access_token);
                sessionStorage.setItem('user_info', JSON.stringify(body.payload.user));
                navigate('/');
            }
            if(error) {
                console.error(errorMessage);
            }

        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.response) {
                const errorMessage = error.response.data.message || 
                                    'Registration failed. Please try again.';
                setErrorMessage(errorMessage);
            } else if (error.request) {
                setErrorMessage('No response from server. Please check your connection.');
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    }

    return (
        <div className="register-form">
            <h1>WhatsApp Register!</h1>
            <form onSubmit={handleSubmitRegisterForm}>
                <div>
                    <label htmlFor="name">Write your name:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="name"
                        onChange={handleChangeInputValue}
                        value={form_values_state.name}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Write your email:</label>
                    <input
                        type='email'
                        name="email"
                        id="email"
                        placeholder="JohnDoe@gmail.com"
                        onChange={handleChangeInputValue}
                        value={form_values_state.email}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Write your password:</label>
                    <input
                    type='password'
                        name="password"
                        id="password"
                        placeholder="*"
                        onChange={handleChangeInputValue}
                        value={form_values_state.password}
                        required
                    />
                </div>
                <button type="submit">Register!</button>
            </form>
            <span>
                If you already have an account <Link to="/login">Login</Link>
            </span>
        </div>
    );
}

export default Register