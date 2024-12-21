import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Screens/Login/Login'
import Register from './Screens/Register/Register'
import ForgotPassword from './Screens/ForgotPassword/ForgotPassword'
import Contacts from './Screens/ContactHome/ContactHome'
import ProtectedRoute from './components/ProtectedRoute'
import ResetPassword from './Screens/ResetPassword/ResetPassword'
import MessageList from './Screens/Message/MessageList'
import ContactHome from './Screens/ContactHome/ContactHome'
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:reset_token" element={<ResetPassword />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/contact-home" element={<ContactHome />} />
                    <Route path="/contactList/:contact_id" element={<Contacts />} />
                    <Route path="/message/:contact_id" element={<MessageList />} />
                </Route>
            </Routes>
        </>
    )
}

export default App
