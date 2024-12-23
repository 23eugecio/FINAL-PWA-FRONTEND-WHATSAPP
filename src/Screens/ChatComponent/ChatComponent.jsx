import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../MessageChat/MessageChat.css';

const ChatComponent = ({ allContacts }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const { contact_id } = useParams();
    const contact = allContacts?.find(contact => contact.id.toString() === contact_id);

    useEffect(() => {
        const loadMessages = () => {
            const storedMessages = sessionStorage.getItem(`chat_messages_${contact_id}`);
            if (storedMessages) {
                setMessages(JSON.parse(storedMessages));
            }
        };

        loadMessages();
        const intervalId = setInterval(loadMessages, 1000);
        return () => clearInterval(intervalId);
    }, [contact_id]);

    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem(`chat_messages_${contact_id}`, JSON.stringify(messages));
        }
    }, [messages, contact_id]);

    const addMessage = (messageText) => {
        const newMessage = {
            id: Date.now(),
            author: 'yo',
            text: messageText,
            day: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            estado: 'sent'
        };

        setTimeout(() => {
            const responseMessage = {
                id: Date.now() + 1,
                author: contact?.name || 'them',
                text: `Reply to: ${messageText}`,
                day: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                estado: 'received'
            };
            setMessages(prev => [...prev, responseMessage]);
        }, 1000);

        setMessages(prev => [...prev, newMessage]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            addMessage(inputMessage);
            setInputMessage('');
        }
    };

    const Message = ({ author, content, date, status }) => (
        <div className={`message ${author === 'yo' ? 'message-right' : 'message-left'}`}>
            <div className="message-author">{author}</div>
            <div className="message-content">{content}</div>
            <div className="message-info">
                {date}
                <span className={`message-status status-${status}`}>
                    {status === 'sent' && '✓'}
                    {status === 'delivered' && '✓✓'}
                    {status === 'read' && '✓✓'}
                </span>
            </div>
        </div>
    );

    return (
        <div className="chat-container">
            <header className="chat-header">
                <div className="header-left">
                    <Link to="/contact-home" className="back-button">
                        <i className="bi bi-arrow-left"></i>
                    </Link>
                    <div className="contact-info">
                        {contact && (
                            <Link to={`/profile/${contact.id}`}>
                                <img src={contact.thumbnail} className="profile-image" alt="" />
                            </Link>
                        )}
                        <span className="contact-name">{contact?.name}</span>
                    </div>
                </div>
                <div className="header-actions">
                    <i className="bi bi-camera-video header-icon"></i>
                    <i className="bi bi-telephone header-icon"></i>
                    <i className="bi bi-three-dots-vertical header-icon"></i>
                </div>
            </header>

            <div className="messages-container">
                {messages.map(data => (
                    <Message
                        key={data.id}
                        author={data.author}
                        content={data.text}
                        date={data.day}
                        status={data.estado}
                    />
                ))}
            </div>

            <footer className="chat-footer">
                <form onSubmit={handleSubmit} className="message-form">
                    <button type="button" className="emoji-button">
                        <i className="bi bi-emoji-smile"></i>
                    </button>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message"
                        className="message-input"
                    />
                    <div className="footer-actions">
                        <i className="bi bi-paperclip footer-icon"></i>
                        <i className="bi bi-camera footer-icon"></i>
                        <button type="submit" className="send-button">
                            <i className="bi bi-send"></i>
                        </button>
                    </div>
                </form>
            </footer>
        </div>
    );
};

export default ChatComponent;