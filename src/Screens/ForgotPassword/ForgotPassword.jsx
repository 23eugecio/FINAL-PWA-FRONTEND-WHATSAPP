import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './ForgotPassword.css'
import ENVIRONMENT from '../../environment'
import { getUnnauthenticatedHeaders, POST } from '../../fetching/http.fetching'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmitLoginForm = async (event) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address')
            return
        }

        try {
            const body = await POST(`${ENVIRONMENT.URL_BACK}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getUnnauthenticatedHeaders(),
                },
                body: JSON.stringify({ email })
            })

            if (body && body.ok) {
                setSuccess('Password reset link sent successfully')
                setEmail('')
            } else {
                setError(body?.errors?.[0] || 'Failed to send reset link')
            }
        } catch (error) {
            setError(error?.message || 'An unexpected error occurred')
            console.error(error)
        }
    }

    return (
        <div className="forgot-password-container">
            <h1>Forgot Password</h1>
            <p>Enter your email and we'll send you a link to reset your password.</p>
            
            <form onSubmit={handleSubmitLoginForm}>
                <div>
                    <label htmlFor='email'>Email:</label>
                    <input 
                        type="email"
                        name='email' 
                        id='email' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='john@gmail.com' 
                        required
                    />
                </div>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <button type='submit'>Send Reset Link</button>
            </form>
            
            <div className="form-links">
                <span>Don't have an account? <Link to='/register'>Register</Link></span>
                
                <span>Already have an account? <Link to='/login'>Login</Link></span>
            </div>
        </div>
    )
}

export default ForgotPassword

