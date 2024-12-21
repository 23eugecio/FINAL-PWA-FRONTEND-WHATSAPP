import React, { useState } from 'react'
import './FooterMessage.css'


const FooterMessage = ({ addMessage }) => {
    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (message.trim()) {
            addMessage(message)
            setMessage('')
        }
    }

    const handleSendClick = () => {
        if (message.trim()) {
            addMessage(message)
            setMessage('')
        }
    }

    return (
        <div className="footerMessage">
                <form className="message-input" onSubmit={handleSubmit}>
                    <span className="emojis">
                        <i className="bi bi-emoji-smile"></i>
                    </span>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='message'
                        className='message-field'
                    />
                    <span className="icons">
                        <i className="bi bi-paperclip"></i>
                        <i className="bi bi-camera"></i>
                    <button type='button' className="send" onClick={handleSendClick}>
                    <i className="bi bi-send"></i>
                    </button>
                    </span>
                </form>
            </div>
    )
}

export default FooterMessage