import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { extractFormData } from '../../utils/extractFormData';
import { POST } from '../../Fetching/http.fetching';
import './ForgotPassword.css';
import '../../App.css';

const ForgotPassword = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmitForgotPasswordForm = async (e) => {
        e.preventDefault();
        setError(null);
        const form_HTML = e.target;
        const form_Values = new FormData(form_HTML);
        const form_fields = { email: '' };
        const form_values_object = extractFormData(form_fields, form_Values);

        try {
            const data = await POST('/api/auth/forgot-password', form_values_object, false); // Utiliza la función POST mejorada

            if (data.message === 'Email sent successfully') {
                navigate('/login');
            } else {
                setError(data.message || 'Failed to send email. Please try again.');
            }
        } catch (error) {
            console.error('Error during password reset request:', error);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className='forgot-password-container'>
            <h1>Forgot your Password?</h1>
            <p>We will send you an email to reset your password, please verify your email!</p>
            <form onSubmit={handleSubmitForgotPasswordForm}>
                <div>
                    <label htmlFor='email'>Enter your email:</label>
                    <input
                        name='email'
                        id='email'
                        placeholder='pepe@gmail.com'
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type='submit'>Send!</button>
                <div className='login'>
                    If you already have an account... <Link to='/login'>Login!</Link>
                </div>
                <div>
                    Don't have an account yet! <Link to='/register'>Register!</Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
