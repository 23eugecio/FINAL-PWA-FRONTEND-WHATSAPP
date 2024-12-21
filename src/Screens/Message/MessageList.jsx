import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthenticatedHeaders, POST } from '../../Fetching/http.fetching';
import ENVIROMENT from '../../enviroment';

const MessageList = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messageForm, setMessageForm] = useState({
        content: '',
        receiver_id: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const userId = sessionStorage.getItem('user_id');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            try {
                const response = await POST(`${ENVIROMENT.URL_BACK}/api/message`, {
                    headers: getAuthenticatedHeaders(),
                    body: JSON.stringify({
                        user_id: userId
                    })
                });

                if (response.ok) {
                    const filteredContacts = response.data.users.filter(
                        user => user.user_id !== userId
                    );
                    setContacts(filteredContacts);
                } else {
                    throw new Error('Failed to fetch contacts');
                }
            } catch (err) {
                console.error('Error loading contacts:', err);
                setError('Error loading contacts');
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [userId]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedContact) return;
            setLoading(true);
            try {
                const response = await POST(`${ENVIROMENT.URL_BACK}/api/messages/history`, {
                    headers: getAuthenticatedHeaders(),
                    body: JSON.stringify({
                        user_id: userId,
                        contact_id: selectedContact.id
                    })
                });

                if (response.ok) {
                    setMessages(response.data.messages);
                    scrollToBottom();
                } else {
                    throw new Error('Failed to fetch messages');
                }
            } catch (err) {
                console.error('Error loading messages:', err);
                setError('Error loading messages');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [selectedContact, userId]);

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const handleContactSelect = useCallback((contact) => {
        setSelectedContact(contact);
        setMessageForm((prev) => ({
            ...prev,
            receiver_id: contact.id
        }));
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!messageForm.content.trim()) {
            setError('Message cannot be empty');
            return;
        }

        try {
            const response = await POST(`${ENVIROMENT.URL_BACK}/api/auth/message`, {
                headers: getAuthenticatedHeaders(),
                body: JSON.stringify(messageForm)
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setSuccess('Message sent successfully');
            setMessageForm((prev) => ({
                ...prev,
                content: ''
            }));

            // Refresh messages
            if (selectedContact) {
                const messagesResponse = await POST(`${ENVIROMENT.URL_BACK}/api/messages/history`, {
                    headers: getAuthenticatedHeaders(),
                    body: JSON.stringify({
                        user_id: userId,
                        contact_id: selectedContact.id
                    })
                });

                if (messagesResponse.ok) {
                    setMessages(messagesResponse.data.messages);
                    scrollToBottom();
                }
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Error sending message');
        }
    };

    return (
        <div className="messages-container">
            <div className="contacts-sidebar">
                <h2>Contacts</h2>
                {loading ? <p>Loading contacts...</p> : (
                    contacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => handleContactSelect(contact)}
                            className={selectedContact?.id === contact.id ? 'selected' : ''}
                        >
                            <img
                                src={contact.image || '/placeholder-avatar.png'}
                                alt={contact.name}
                            />
                            <div>
                                <h3>{contact.name}</h3>
                                <p>{contact.email}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="messages-content">
                {selectedContact ? (
                    <>
                        <div className="messages-header">
                            <h2>Chat with {selectedContact.name}</h2>
                        </div>

                        <div className="messages-list">
                            {messages.length === 0 ? (
                                <p>No messages yet</p>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={message.sender_id === userId ? 'sent' : 'received'}
                                    >
                                        <p>{message.content}</p>
                                        <span>{new Date(message.created_at).toLocaleString()}</span>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="message-form">
                            {error && <div className="error">{error}</div>}
                            {success && <div className="success">{success}</div>}

                            <textarea
                                value={messageForm.content}
                                onChange={(e) => setMessageForm({
                                    ...messageForm,
                                    content: e.target.value
                                })}
                                placeholder="Write your message..."
                                rows="3"
                            />
                            <button type="submit" disabled={!messageForm.content.trim()}>Send</button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        Select a contact to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageList;





