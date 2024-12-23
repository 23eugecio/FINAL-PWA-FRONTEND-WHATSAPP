import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { extractFormData } from '../../utils/extractFormData'
import { getAuthenticatedHeaders, PUT } from '../../Fetching/http.fetching'
import ENVIROMENT from '../../enviroment'
import './ResetPassword.css'


const ResetPassword = () => {
    const { reset_token } = useParams()
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setError] = useState('')
    const handleSubmitResetForm = async (e) => {
        try{
        e.preventDefault()
        const form_HTML = e.target
        const form_Values = new FormData(form_HTML)
        const form_fields = {
            'password': ''
        }
        const form_values_object = extractFormData(form_fields, form_Values)

        if(!reset_token){
            setError('Reset token is not valid!')
            return
        }
        const response = await PUT(`${ENVIROMENT.URL_BACK}/api/auth/reset-password` + reset_token, {
            headers: getAuthenticatedHeaders(),
            body: JSON.stringify(form_values_object)
        })
        if(response.ok){
            setSuccessMessage('Password reset successfully!')
            console.log(successMessage)
        }
        if(errorMessage){
            console.log(errorMessage)
        } 
        else{
            setError('Password reset failed!')
        }
        console.log(response)
        }
        catch(error){
            setError('Password reset failed!')
        }
    }
    
    return (
        <div>
            <h1>Reset your password</h1>
            <p>Complete the form below to reset your password.</p>
            <form onSubmit={handleSubmitResetForm}>
                <div>
                    <label htmlFor='password'>Enter your new password:</label>
                    <input name='password' id='password' placeholder='contraseña' />
                </div>
                <button type='submit'>Reset Password</button>
            </form>
            <span>If you already have an account, please <Link to='/login'>Login</Link></span>
            <span>If you don't have an account, please <Link to='/register'>Register</Link></span>
        {successMessage && <p>{successMessage}</p>}
        </div>
    )
}

export default ResetPassword