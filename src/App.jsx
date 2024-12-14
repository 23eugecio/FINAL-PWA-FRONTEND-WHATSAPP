import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Screens/Login/Login'
import Register from './Screens/Register/Register'
import ForgotPassword from './Screens/ForgotPassword/ForgotPassword'
import Contact from './Screens/Contact/Contact'
import ProtectedRoute from './components/ProtectedRoute'
import ResetPassword from './Screens/ResetPassword/ResetPassword'
function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />


                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path='/reset-password/:reset_token' element={<ResetPassword />} />
                    <Route element={<ProtectedRoute />}>
                    <Route path="/contact" element={<Contact />} />
{/*                     <Route path='/message' element={<Message />} /> */}
                </Route>
            </Routes>
        </>
    )
}

export default App
