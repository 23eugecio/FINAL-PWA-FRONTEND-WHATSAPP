import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { extractFormData } from '../../utils/extractFormData'
import { getAuthenticatedHeaders } from '../../Fetching/http.fetching'
import ENVIROMENT from '../../enviroment'

const ResetPassword = () => {
    const { reset_token } = useParams()
    const [successMessage, setSuccessMessage] = React.useState('')
    const [errorMessage, setError] = React.useState('')
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
        } else  {
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
            <h1>Restablecer contraseña</h1>
            <p>Completa el formulario con la nueva contraseña para restablecerla.</p>
            <form onSubmit={handleSubmitResetForm}>
                <div>
                    <label htmlFor='password'>Ingrese su nueva contraseña:</label>
                    <input name='password' id='password' placeholder='contraseña' />
                </div>
                <button type='submit'>Restablecer contraseña</button>
            </form>
            <span>Si recuerdas tu contraseña <Link to='/login'>iniciar sesion</Link></span>
            <span>Si aun no tienes cuenta puedes <Link to='/register'>Registrarte</Link></span>

        </div>
    )
}

export default ResetPassword