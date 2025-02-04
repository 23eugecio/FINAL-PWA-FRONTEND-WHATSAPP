import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {ENVIRONMENT } from '../../environment.js';
import './ContactHome.css';
import '../../App.css';
import { POST } from '../../Fetching/http.fetching.js';
import useContact from '../../Hooks/useContact';
import { useAuthContext } from '../../context/AuthContext'; 

const ContactHome = () => {
    const { contacts, isLoading, error, setContacts } = useContact();
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [contactForm, setContactForm] = useState({ name: '', email: '', image: '' });
    const [editingId, setEditingId] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const { isAuthenticatedUser, getAuthToken } = useAuthContext(); 

    useEffect(() => {
        if (!isAuthenticatedUser) {
            console.log("No autenticado. Redirigiendo a /login");
            navigate('/login'); 
        }
    }, [isAuthenticatedUser, navigate]);

    const validateForm = () => {
        const errors = {};
        if (!contactForm.name.trim()) errors.name = 'Name is required';
        if (!contactForm.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(contactForm.email)) errors.email = 'Invalid email format';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setContactForm(prevForm => ({ ...prevForm, [field]: value }));
        setFormErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const token = getAuthToken();
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const data = await POST(`${ENVIRONMENT.URL_BACK}/api/contacts/add`, {
                contact_username: contactForm.name.trim(),
                email: contactForm.email.trim(),
                image: contactForm.image.trim()
            }, true);

            setContacts(prevContacts => [...prevContacts, data]);
            setContactForm({ name: '', email: '', image: '' });
            setEditingId(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error saving contact:', error);
            if (error.message === 'Unauthorized') {
                navigate('/login');
            } else {
                alert(error.message || 'An unexpected error occurred');
            }
        }
    };

    const handleEdit = (contact) => {
        setContactForm({
            name: contact.contact_username,
            email: contact.email,
            image: contact.image
        });
        setEditingId(contact._id);
        setShowForm(true);
    };

    const handleAddContact = () => {
        setContactForm({ name: '', email: '', image: '' });
        setEditingId(null);
        setShowForm(true);
    };

    const visibleContacts = contacts.filter(contact =>
        contact.contact_username && contact.contact_username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div>Loading contacts...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="contacts-container">
            <header className="contacts-header">
                <h1>Contacts</h1>
                <button className="add-button" onClick={handleAddContact}>Add Contact</button>
            </header>

            <input
                type="text"
                placeholder="Search Contacts"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            {showForm && (
                <form onSubmit={handleSubmit} className="contact-form">
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            value={contactForm.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                        {formErrors.name && <span className="error">{formErrors.name}</span>}
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={contactForm.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                        {formErrors.email && <span className="error">{formErrors.email}</span>}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={contactForm.image}
                            onChange={(e) => handleInputChange('image', e.target.value)}
                        />
                    </div>

                    <button type="submit">
                        {editingId ? 'Save Changes' : 'Add Contact'}
                    </button>
                </form>
            )}

            <div className="contacts-list">
                {visibleContacts.map(contact => (
                    <Link to={`/chat/${contact._id}`} className="contact-card" key={contact._id}>
                        <img
                            className="contact-image"
                            src={contact.image || '/ImageContacts/default.jpg'}
                            alt={contact.contact_username}
                        />
                        <h3>{contact.contact_username}</h3>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleEdit(contact);
                            }}
                            className="edit-button"
                        >
                            Edit
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ContactHome;
