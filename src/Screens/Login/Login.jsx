import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { extractFormData } from '../../utils/extractFormData'
import { POST, getUnnauthenticatedHeaders } from '../../Fetching/http.fetching'
import ENVIROMENT from '../../enviroment'
import './Login.css'
const Login = () => {	
	const navigate = useNavigate()

	const handleSubmitLoginForm = async (e) => {
		try{
			e.preventDefault()
			const form_HTML = e.target
			const form_Values = new FormData(form_HTML)
			const form_fields = {
				'email': '',
				'password': ''
			}
			const form_values_object = extractFormData(form_fields, form_Values)
			const response = await POST(
				`${ENVIROMENT.URL_BACK}/api/auth/login`,
				{
					headers: getUnnauthenticatedHeaders(),
					body: JSON.stringify(form_values_object)
				} 
			)
			const access_token = response.payload.token
			sessionStorage.setItem('access_token', access_token)
			sessionStorage.setItem('user_info', JSON.stringify(response.payload.user))
			navigate('/home')
		}
		catch(error){
            console.error('Login error:', error)
		}
	}
    return (
        <div className="login-container">
            <h1>Login!</h1>
            <form onSubmit={handleSubmitLoginForm}>
                <div>
                    <label htmlFor="email">Enter your Email:</label>
                    <input
                        name="email"
                        id="email"
                        placeholder="john@gmail.com"
                        type="email"
                    />
                </div>
                <div>
                    <label htmlFor="password">Enter your Password:</label>
                    <input
                        name="password"
                        id="password"
                        placeholder="Password"
                        type="password"
                    />
                </div>
                <button type="submit">Login</button>
                <span>
                    If you don't have an account yet?
                    <button>
                        <Link to="/register">Register yourself!</Link>
                    </button>
                </span>
                <span>
                    Forgot your password? <button><Link to="/forgot-password">Click here!</Link></button>
                </span>
            </form>
        </div>
    )
}

export default Login
