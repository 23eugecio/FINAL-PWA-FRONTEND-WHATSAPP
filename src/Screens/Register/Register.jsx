import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { ENVIRONMENT } from '../../environment.js';
import useForm from '../../Hooks/useForm.jsx';
import { getUnnauthenticatedHeaders, POST } from '../../Fetching/http.fetching.js';
import { extractFormData } from '../../utils/extractFormData.js';
import '../../App.css';

const Register = () => {
    const form_fields = {
        'name': '',
        'email': '',
        'password': ''
    };

    const navigate = useNavigate();
    const { form_values_state, handleChangeInputValue } = useForm(form_fields);

    const handleSubmitRegisterForm = async (event) => {
        event.preventDefault();
        const form_HTML = event.target;
        const form_values = new FormData(form_HTML);
        const form_values_object = extractFormData(form_fields, form_values);

        try {
            const response = await POST(
                `${ENVIRONMENT.URL_BACK}/api/auth/register`,
                {
                    headers: getUnnauthenticatedHeaders(),
                    body: JSON.stringify(form_values_object)
                }
            );

            console.log('Registration response:', response);

            if (response.message === 'Registro exitoso, por favor verifica tu email') {
                navigate('/login');
            } else {
                console.error('Registration error:', response.message);
            }
        } catch (error) {
            console.error('Request error:', error);
            if (error.message.includes('Clave duplicada')) {
                alert('Email already registered');
            }
        }
    }

    return (
        <div className="register-container">
            <div className="register-form">
                <h1>WhatsApp Register!</h1>
                <form onSubmit={handleSubmitRegisterForm} className='form'>
                    <div className="register-form-fields">
                        <div className="form-group">
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
                        <div className="form-group">
                            <label htmlFor="email">Write your email:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="JohnDoe@gmail.com"
                                onChange={handleChangeInputValue}
                                value={form_values_state.email}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Write your password:</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password!"
                                onChange={handleChangeInputValue}
                                value={form_values_state.password}
                                required
                            />
                        </div>
                        <button type="submit" className="register-button">Register!</button>
                    </div>
                </form>
                <div className="form-links">
                    <span>
                        If you already have an account <Link to="/login" className="login-link">Login!</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Register;
