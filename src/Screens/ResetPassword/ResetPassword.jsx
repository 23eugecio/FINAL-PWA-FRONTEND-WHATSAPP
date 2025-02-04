import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { extractFormData } from '../../utils/extractFormData';
import { PUT } from '../../Fetching/http.fetching';

import './ResetPassword.css';
import '../../App.css';

const ResetPassword = () => {
    const { reset_token } = useParams();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setError] = useState('');

    const handleSubmitResetForm = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setError('');

        const form_HTML = e.target;
        const form_Values = new FormData(form_HTML);
        const form_fields = {
            'password': ''
        };
        const form_values_object = extractFormData(form_fields, form_Values);

        if (!reset_token) {
            setError('Reset token is not valid!');
            return;
        }

        try {
            const response = await PUT(`/api/auth/reset-password/${reset_token}`, form_values_object, false); // Utiliza la función PUT mejorada

            if (response) {
                setSuccessMessage('Password reset successfully!');
            } else {
                setError('Password reset failed!');
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            setError('An unexpected error occurred');
        }
    };

    return (
        <div>
            <h1>Reset your password</h1>
            <p>Complete the form below to reset your password.</p>
            <form onSubmit={handleSubmitResetForm}>
                <div>
                    <label htmlFor='password'>Enter your new password:</label>
                    <input
                        name='password'
                        id='password'
                        placeholder='contraseña'
                        type='password'
                        required
                    />
                </div>
                <button type='submit'>Reset Password</button>
            </form>
            <span>If you already have an account, please <Link to='/login'>Login</Link></span>
            <span>If you don't have an account, please <Link to='/register'>Register</Link></span>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default ResetPassword;
