import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactHome.css';
import ENVIROMENT from '../../enviroment';
import { getAuthenticatedHeaders, POST } from '../../Fetching/http.fetching';

const ContactHome = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState(() => {
        const savedContacts = sessionStorage.getItem('contacts');
        return savedContacts
            ? JSON.parse(savedContacts)
            : [
                { id: 1, name: 'Juan Pérez', email: 'juan@email.com', image: '' },
                { id: 2, name: 'Maria Gomez', email: 'maria@email.com', image: '' },
                
                ,
            ];
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        image: '',
    });

    useEffect(() => {
        sessionStorage.setItem('contacts', JSON.stringify(contacts));
    }, [contacts]);

    const validateForm = () => {
        const errors = {};
        if (!contactForm.name.trim()) errors.name = 'Name is required';
        if (!contactForm.email.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email))
            errors.email = 'Invalid email format';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (contact) => {
        setContactForm({ name: contact.name, email: contact.email, image: contact.image });
        setEditingId(contact.id);
        setShowForm(true);
    };

    const getNextId = () => {
        if (contacts.length === 0) return 1;
        return Math.max(...contacts.map((contact) => contact.id)) + 1;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (editingId) {
            setContacts(
                contacts.map((contact) =>
                    contact.id === editingId
                        ? { ...contact, name: contactForm.name, email: contactForm.email, image: contactForm.image }
                        : contact
                )
            );
        } else {
            setContacts([
                ...contacts,
                {
                    id: getNextId(),
                    name: contactForm.name,
                    email: contactForm.email,
                    image: contactForm.image,
                },
            ]);
        }

        setContactForm({ name: '', email: '', image: '' });
        setEditingId(null);
        setShowForm(false);
        setFormErrors({});

        try {
            const response = await POST(
                `${ENVIROMENT.URL_BACK}/api/auth/message`,
                {
                    headers: getAuthenticatedHeaders(),
                    body: JSON.stringify(contactForm),
                }
            );
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const data = await response.json();
            sessionStorage.setItem('access_token', data.payload.token);
            sessionStorage.setItem('user_info', JSON.stringify(data.payload.user));


        } catch (error) {
            console.error('Error al realizar el fetch:', error);
        }
    };

    return (
        <div className="contacts-container">
            <header className="contacts-header">
                <h1>Contacts</h1>
                <div className="header-buttons">
                    <button onClick={() => setShowForm(true)}>Add Contact</button>
                </div>
            </header>

            <div className="search-container">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Find a contact..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {showForm && (
                <div className="form-overlay">
                    <div className="form-container">
                        <h2 className="form-title">
                            {editingId ? 'Edit Contact' : 'New Contact'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Name"
                                    value={contactForm.name}
                                    onChange={(e) =>
                                        setContactForm({
                                            ...contactForm,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                            </div>

                            <div className="form-group">
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Email"
                                    value={contactForm.email}
                                    onChange={(e) =>
                                        setContactForm({
                                            ...contactForm,
                                            email: e.target.value,
                                        })
                                    }
                                />
                                {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                            </div>

                            <div className="form-group">
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="Image URL"
                                    value={contactForm.image}
                                    onChange={(e) =>
                                        setContactForm({
                                            ...contactForm,
                                            image: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <button type="submit" className="form-button">
                                {editingId ? 'Save Changes' : 'Add Contact'}
                            </button>
                        </form>
                    </div>
                </div>
            )}


            <div className="contacts-list">
                {filteredContacts.map((contact) => (
                    <div key={contact.id} className="contact-item">
                        <img
                            src={contact.image || '/public/ImageContacts/default.jpg'}
                            alt={`${contact.image}`}
                            onClick={() => navigate('/messages')}
                        />
                        <div className="contact-info">
                            <h3 className="contact-name">{contact.name}</h3>
                            <p className="contact-email">{contact.email}</p>
                        </div>
                        <button
                            className="edit-button"
                            onClick={() => handleEdit(contact)}
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactHome;
