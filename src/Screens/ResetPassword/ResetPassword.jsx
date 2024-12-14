import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import extractFormData from '../../utils/extractFormData'
import { POST, getUnnauthenticatedHeaders } from '../../Fetching/http.fetching'
import ENVIRONMENT from '../../environment'

const ResetPassword = () => {
const {reset_token} = useParams();
const Navigate = useNavigate();
    const handleSubmitResetForm = async (event) => {
        try {
            event.preventDefault();
            const form_HTML = event.target;
            const form_values = new FormData(form_HTML);
            const form_fields = {
                'email': '',
            };
            const form_values_object = extractFormData(form_fields, form_values);

            const response = await POST(`${ENVIRONMENT.URL_BACK}/api/auth/reset-password`, 
                {
                headers: getUnnauthenticatedHeaders(),
                body: JSON.stringify(form_values_object)
            });

            if(response.ok) {
                const access_token = response.payload.token;
                sessionStorage.setItem('access_token', access_token);
                sessionStorage.setItem('user_info', JSON.stringify(response.payload.user));

                Navigate('/'); 
            } else {
                error(response.payload.detail);
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }
    
    return (
        <div className="login-container">
        <h1>Reset your Password!</h1>
        <form onSubmit={handleSubmitResetForm}>
            <div>
                <label htmlFor="email">Enter your Email:</label>
                <input
                    name="email"
                    id="email"
                    placeholder="john@gmail.com"
                />
            </div>
            <button type="submit">Reset!</button>
            </form>
            <span>
                If you don't have an account yet?
                <button>
                    <Link to="/register">Click here! and Register.</Link>
                </button>
            </span>
            <span>
                Forgot your password? <button><Link to="/forgot-password">Click here!</Link></button>
            </span>
    </div>
    )
}

export default ResetPassword