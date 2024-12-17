import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import ENVIROMENT from '../../enviroment.js';
import useForm from '../../Hooks/useForm.jsx';
import { getUnnauthenticatedHeaders, POST } from '../../Fetching/http.fetching.js';
import { extractFormData } from '../../utils/extractFormData.js';


const Register = () => {

    const form_fields = {
        'name': '',
        'email': '',
        'password': ''
    }
    const navigate = useNavigate()
    const { form_values_state, handleChangeInputValue } = useForm(form_fields)
    const handleSubmitRegisterForm = async (event) => {
        event.preventDefault()
        const form_HTML = event.target
        const form_values = new FormData(form_HTML)
        const form_values_object = extractFormData(form_fields, form_values)

        const body = await POST(
            `${ENVIROMENT.URL_BACK}/api/auth/register`,
            {
                headers: getUnnauthenticatedHeaders(),
                body: JSON.stringify(form_values_object) 
            }
        )
            .then(
                (response_HTTP) => { 
                    console.log({ response_HTTP })
                return response_HTTP.json()
                }
            )
            .then(
                (body) =>{
                    console.log({ body })
                }
            )
            .catch(
                (error) => { console.error(error) }
            )
        console.log(body)
        navigate('/Contact')
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
                        placeholder="Password!"
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