import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../GlobalStyle/GlobalStyle.css';

const ContactHome = () => {
    const [allContacts, setAllContacts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [contactForm, setContactForm] = useState({ name: '', email: '', image: '' });
    const [editingId, setEditingId] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = sessionStorage.getItem('user_info');
        const token = sessionStorage.getItem('access_token');
    
        if (!userInfo || !token) {
            navigate('/login');
            return;
        }
    
        const savedContacts = sessionStorage.getItem('contacts');
        if (savedContacts) {
            try {
                setAllContacts(JSON.parse(savedContacts) || []);
            } catch (error) {
                console.error('Error parsing contacts:', error);
                setAllContacts([]);
            }
        } else {
            setAllContacts([]); 
        }
    }, [navigate]);
    

    useEffect(() => {
        sessionStorage.setItem('contacts', JSON.stringify(allContacts));
    }, [allContacts]);

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const newContact = {
            id: editingId || allContacts.length + 1,
            name: contactForm.name.trim(),
            email: contactForm.email.trim(),
            image: contactForm.image.trim() || '/ImageContacts/default.jpg',
        };

        if (editingId) {
            setAllContacts(allContacts.map(contact => 
                contact.id === editingId ? newContact : contact
            ));
        } else {
            setAllContacts([...allContacts, newContact]);
        }

        setContactForm({ name: '', email: '', image: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (contact) => {
        setContactForm({ name: contact.name, email: contact.email, image: contact.image });
        setEditingId(contact.id);
        setShowForm(true);
    };

    const handleAddContact = () => {
        setContactForm({ name: '', email: '', image: '' });
        setEditingId(null);
        setShowForm(true);
    };

    const visibleContacts = allContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            />

            {showForm && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={contactForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={contactForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Image URL"
                        value={contactForm.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                    />

                    <button type="submit">{editingId ? 'Save' : 'Add Contact'}</button>
                </form>
            )}

            <div className="contacts-list">
                {visibleContacts.map(contact => (
                    <Link to={'/chat/' + contact.id} className="contact-card" key={contact.id}>
                        <img className="contact-image" src={contact.image || '/ImageContacts/default.jpg'} alt={''} />
                        <h3>{contact.name}</h3>
                        <button onClick={(e) => { e.preventDefault(); handleEdit(contact); }}>Edit</button>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ContactHome;
