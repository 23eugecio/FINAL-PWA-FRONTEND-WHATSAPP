import React, { useState } from 'react';
import './Contact.css';
import ENVIROMENT from '../../enviroment.js';
import { getAuthenticatedHeaders, POST } from '../../Fetching/http.fetching.js';

const ContactItem = ({ contact }) => (
    <div className='contact-item'>
        <img src={contact.image || '/default-avatar.png'} alt={contact.name} />
        <div className='contact-details'>
            <h3>{contact.name}</h3>
            <p>{contact.phone}</p>
            <p>{contact.email}</p>
        </div>
    </div>
);

const ContactForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });
    const [image, setImage] = useState('');
    const FILE_MB_LIMIT = 2;

    const handleChangeInput = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChangeFile = (event) => {
        const file = event.target.files[0];
        if (file && file.size > FILE_MB_LIMIT * 1024 * 1024) {
            alert(`Error: File is too large (limit ${FILE_MB_LIMIT} MB)`);
            return;
        }

        const fileReader = new FileReader();
        fileReader.onloadend = () => setImage(fileReader.result);

        if (file) {
            fileReader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, image });
        setFormData({ name: '', phone: '', email: '' });
        setImage('');
    };

    return (
        <form onSubmit={handleSubmit} className='contact-form'>
            <h2>Add New Contact</h2>
            <div className='form-group'>
                <label htmlFor='name'>Name</label>
                <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleChangeInput}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor='phone'>Phone</label>
                <input
                    type='tel'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChangeInput}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChangeInput}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor='image'>Profile Picture</label>
                <input
                    type='file'
                    id='image'
                    name='image'
                    accept='image/*'
                    onChange={handleChangeFile}
                />
            </div>
            {image && (
                <div className='image-preview'>
                    <img src={image} alt='Profile' />
                </div>
            )}
            <button type='submit' className='submit-button'>
                Add Contact
            </button>
        </form>
    );
};

const Contact = () => {
    const [contacts, setContacts] = useState([]);

    const handleAddContact = async (formData) => {
        try {
            const response = await POST(`${ENVIROMENT.URL_BACK}/api/contact    `, {
                headers: getAuthenticatedHeaders(),
                body: JSON.stringify(formData),
            });
            setContacts((prevContacts) => [...prevContacts, response]);
        } catch (error) {
            console.error('Contact creation error:', error);
        }
    };

    return (
        <div className='contact-container'>
            <div className='whatsapp-layout'>
                <div className='top-bar'>
                    <span>WhatsApp Contacts</span>
                    <div className='icons'>
                        <i className='bi bi-camera-video'></i>
                        <i className='bi bi-search'></i>
                        <i className='bi bi-three-dots-vertical'></i>
                    </div>
                </div>

                <div className='contacts-section'>
                    <ContactForm onSubmit={handleAddContact} />

                    <div className='contacts-list'>
                        <h2>Contacts</h2>
                        {contacts.map((contact, index) => (
                            <ContactItem key={index} contact={contact} />
                        ))}
                    </div>
                </div>

                <div className='bottom-navigation'>
                    <i className='bi bi-chat-square-text'></i>
                    <i className='bi bi-people'></i>
                    <i className='bi bi-telephone'></i>
                </div>
            </div>
        </div>
    );
};

export default Contact;
