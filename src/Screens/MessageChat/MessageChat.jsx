import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../GlobalStyle/GlobalStyle.css';
import { getUnnauthenticatedHeaders, POST } from '../../Fetching/http.fetching';



const Chat = ({ receiverId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();
        const messageInterval = setInterval(fetchMessages, 3000);
        
        return () => clearInterval(messageInterval);
    }, [receiverId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await POST(`/api/messages/conversation/${receiverId}`, {
                headers: getUnnauthenticatedHeaders(),
                body: JSON.stringify({
                    user_id: sessionStorage.getItem('user_id')
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `Server error: ${response.status}`);
            }
            
            if (data.ok) {
                setMessages(data.data.conversation);
            } else {
                throw new Error(data.message || 'Invalid response format');
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                receiverId
            });
            
            const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
            
            setError(errorMessage);
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const user_info= sessionStorage.getItem('access_token');

            if (!access_token || !token) {
                throw new Error('No authentication token found');
            }

            const response = await POST('/api/messages', 
                {
                headers: getUnnauthenticatedHeaders(),
                body: JSON.stringify(
                    {
                    receiver_id: receiverId,
                    content: newMessage.trim()
                }
            )
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `Server error: ${response.status}`);
            }
            
            if (data.ok) {
                setMessages(data.data.conversation);
                setNewMessage('');
                scrollToBottom();
            } else {
                throw new Error(data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', {
                message: error.message,
                stack: error.stack,
                receiverId
            });
            
            const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <div className="message-container">

            <div className="chat-header">
                <button onClick={() => navigate('/contacts')} className="back-button">
                    <ArrowLeft />
                </button>
                <div className="header-info">
                    <h2>Chat</h2>
                </div>
            </div>

            <div className="messages-area">
                {loading ? (
                    <div className="loading-messages">
                        <div className="loading-spinner">Loading messages...</div>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>{error}</p>
                        <button 
                            onClick={() => {
                                setError(null);
                                setLoading(true);
                                fetchMessages();
                            }} 
                            className="retry-button"
                        >
                            Retry
                        </button>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages yet. Start a conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message._id}
                            className={`message-wrapper ${
                                message.author === currentUser ? 'message-sent' : 'message-received'
                            }`}
                        >
                            <div className="message-bubble">
                                <p className="message-content">{message.content}</p>
                                <span className="message-timestamp">
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="message-input-form">
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="message-input"
                    />
                    <button 
                        type="submit" 
                        className="send-button"
                        disabled={!newMessage.trim()}
                    >
                        <Send />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;