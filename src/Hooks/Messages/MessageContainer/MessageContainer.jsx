import React from 'react'
import './MessageContainer.css'
import Messages from '../../Messages/Messages.jsx'


const MessageContainer = ({ messages }) => {
    return (
        <div className="message-container">
            {messages.map(data => (
                <Messages
                    key={data.id}
                    author={data.author}
                    content={data.text}
                    date={data.day}
                    status={data.estado}
                />
            ))}
        </div>
    )
}

export default MessageContainer