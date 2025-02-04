import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Screens/Login/Login'
import Register from './Screens/Register/Register'
import ForgotPassword from './Screens/ForgotPassword/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'
import ResetPassword from './Screens/ResetPassword/ResetPassword'
import ContactHome from './Screens/ContactHome/ContactHome'
import 'bootstrap-icons/font/bootstrap-icons.css';
import MessageChat from './Screens/MessageChat/MessageChat'
import { AuthContextProvider } from './context/AuthContext'
import ChatComponent from './Screens/ChatComponent/ChatComponent'



function App() {

    return (
        <>
        <AuthContextProvider>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:reset_token" element={<ResetPassword />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/contact-home" element={<ContactHome />} />
                    <Route path="/contacts" element={<ContactHome />} />
                    <Route path="/chat/:contact_id" element={<ChatComponent />} />
                    <Route path="/message-chat/:id" element={<MessageChat />} />
                </Route>
            </Routes>
        </AuthContextProvider>
        </>
    )
}

export default App
