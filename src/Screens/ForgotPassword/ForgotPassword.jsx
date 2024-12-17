import { useState } from 'react'
import { Link } from 'react-router-dom'
import { extractFormData } from '../../utils/extractFormData'

const ForgotPassword = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmitLoginForm = async (e) => {
        e.preventDefault()
        const form_HTML = e.target
        const form_Values = new FormData(form_HTML)

        const form_fields = {
            email: ''
        }

        const form_values_object = extractFormData(form_fields, form_Values)

        if (!form_values_object.email) {
            setError("Email is required.")
            return
        }

        setLoading(true)
        try {
            // Send request to reset password
            const response = await POST(`${ENVIROMENT.URL_BACK}api/auth/forgot-password`, {
                headers: getUnnauthenticatedHeaders(),
                body: JSON.stringify(form_values_object)
            })

            if (!response.ok) {
                setError("Failed to send reset email. Please try again.")
                return
            }

            // Send email notification
            const emailResponse = await sendEmailForgot(form_values_object)

            if (!emailResponse.ok) {
                setError("There was an issue sending the email. Please try again later.")
                return
            }

            console.log({ emailResponse })
            // Optionally, redirect the user to a success page or show a success message
        } catch (error) {
            setError("An unexpected error occurred. Please try again.")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Olvidé mi contraseña</h1>
            <p>Enviaremos un mail a tu email de usuario para enviarte los pasos de restablecimiento de la contraseña.</p>

            {error && <div style={{ color: 'red' }}>{error}</div>}

            <form onSubmit={handleSubmitLoginForm}>
                <div>
                    <label htmlFor='email'>Ingrese su email:</label>
                    <input
                        name='email'
                        id='email'
                        placeholder='pepe@gmail.com'
                        type='email'
                        required
                    />
                </div>

                <button type='submit' disabled={loading}>
                    {loading ? "Enviando..." : "Enviar mail"}
                </button>
            </form>

            <span>Si tienes cuenta puedes <Link to='/login'>iniciar sesión</Link></span>
            <span>Si aún no tienes cuenta puedes <Link to='/register'>registrarte</Link></span>
        </div>
    )
}

export default ForgotPassword
