import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { extractFormData } from '../../utils/extractFormData'
import { POST, getUnnauthenticatedHeaders } from '../../Fetching/http.fetching'
import ENVIROMENT from '../../enviroment'
import '../ForgotPassword.css'

const ForgotPassword = () => {
	const handleSubmitForgotPasswordForm = async (e) => {
		try {
			e.preventDefault()
			const form_HTML = e.target
			const form_Values = new FormData(form_HTML)
			const form_fields = {
				'email': ''
			}
			const navigate = useNavigate()
			const form_values_object = extractFormData(form_fields, form_Values)
			console.log(form_values_object)
			const body = await POST(`${ENVIROMENT.URL_BACK}/api/auth/forgot-password`,
				{
					headers: getUnnauthenticatedHeaders(),
					body: JSON.stringify(form_values_object)
				})
			if (!body.ok) {
				setError(body.message)
			}
			console.log({ body })
		}
		catch (error) {
			console.error(error)
		}
	}

	return (
		<div className='forgot-password-container'>
			<h1>Forgot your Password?</h1>
			<p>We will send you an email to reset your password, please verify your email!</p>
			<form onSubmit={handleSubmitForgotPasswordForm}>
				<div>
					<label htmlFor='email'>Enter your email:</label>
					<input name='email' id='email' placeholder='pepe@gmail.com' />
				</div>
				<button type='submit'>Send!</button>
				<div className='login'>If you already have an account...  <Link to='/login'>Login!</Link></div>
				<div>Don't have an account yet!          <Link to='/register'>Register!</Link></div>
				<div>
				</div>
			</form>
		</div>

	)
}

export default ForgotPassword