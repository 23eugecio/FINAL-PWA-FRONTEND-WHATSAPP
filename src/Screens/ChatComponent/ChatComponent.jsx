import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ChatComponent.css';
import { ENVIRONMENT } from '../../environment';

const ChatComponent = ({ allContacts }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { contact_id } = useParams();
    const contact = allContacts?.find(contact => contact.id.toString() === contact_id);

    const loadMessages = async (contact_id) => {
        try {
            const response = await fetch(`${ENVIRONMENT.URL_BACK}/api/messages/${contact_id}`, {
                headers: {
                    'Authorization': `Bearer ${ENVIRONMENT.URL_BACK}/api/messages/${contact_id}`, 
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                console.error('Failed to fetch messages:', response.status);
            }
            const data = await response.json();
            return data.data.conversation;
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            throw error;
        }
    };
    
    const saveMessage = async (message) => {
        try {
            const response = await fetch(`${ENVIRONMENT.URL_BACK}/api/messages/${contact_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify({
                    receiver_id: contact_id,
                    content: message.text
                }),
            });
            if (!response.ok) {
                throw new Error(`error: ${response.status}`);
            }
            const savedMessage = await response.json();
            return savedMessage;
        } catch (error) {
            console.error('Failed to save message:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await loadMessages(contact_id);
                setMessages(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load messages. Please try again later.');
                setLoading(false);
            }
        };

        fetchMessages();
        const intervalId = setInterval(fetchMessages, 1000);
        return () => clearInterval(intervalId);
    }, [contact_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const newMessage = {
                id: Date.now(),
                author: 'yo',
                text: inputMessage,
                day: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                estado: 'sent'
            };

            setMessages(prev => [...prev, newMessage]);
            setInputMessage('');

            try {
                await saveMessage(newMessage);
            } catch (error) {
                setError('Failed to save message. Please try again later.');
            }
        }
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

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
                {loading ? (
                    <div className="loading-messages">
                        <div className="loading-spinner">Loading messages...</div>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>{error}</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages yet. Start a conversation!</p>
                    </div>
                ) : (
                    messages.map(data => (
                        <Message
                            key={data.id}
                            author={data.author}
                            content={data.text}
                            date={data.day}
                            status={data.estado}
                        />
                    ))
                )}
            </div>

            <footer className="chat-footer">
                <form onSubmit={handleSubmit} className="message-form">
                    <button type="button" className="emoji-button">
                        <i className="bi bi-emoji-smile"></i>
                    </button>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={handleInputChange}
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

export default ChatComponent;
