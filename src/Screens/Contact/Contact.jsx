import React, { useState } from 'react'
import './Contact.css'
import ENVIRONMENT from '../../environment.js'
import { getAuthenticatedHeaders, POST } from '../../Fetching/http.fetching.js';



const Contact = () => {
    const [contacts, setContacts] = useState([]);
    const [image, setImage] = useState('');
    const [formData, setFormData] = useState({
'name': '',
'phone': '',
'email': ''
    });

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleChangeFile = (evento) => {
        const file_found = evento.target.files[0];
        const FILE_MB_LIMIT = 2; 

        if (file_found && file_found.size > FILE_MB_LIMIT * 1024 * 1024) {
            alert(`Error: File is too large (limit ${FILE_MB_LIMIT} MB)`);
            return;
        }

        const lector_archivos = new FileReader();
        lector_archivos.onloadend = () => {
            console.log('File loaded');
            console.log(lector_archivos.result);
            setImage(lector_archivos.result);
        }

        if (file_found) {
            lector_archivos.readAsDataURL(file_found);
        }
    }

    const handleSubmitNewContact = async (e) => {
        e.preventDefault();
        const form_values_object = {
            ...formData,
            image: image
        };

        try {
            const response = await POST(`${ENVIRONMENT.URL_FRONT}:3000/api/contacts`, {
                headers: getAuthenticatedHeaders(),
                body: JSON.stringify(form_values_object)
            });

            setContacts(prevContacts => [...prevContacts, response]);
            setFormData({ name: '', phone: '', email: '' });
            setImage('');
        } catch (error) {
            console.error('Contact creation error:', error);
        }
    }

    return (
        <div className='contact-container'>
            <div className='whatsapp-layout'>
                <div className='top-bar'>
                    <span>WhatsApp Contacts</span>
                    <div className='icons'>
                        <i className="bi bi-camera-video"></i>
                        <i className='bi bi-search'></i>
                        <i className='bi bi-three-dots-vertical'></i>
                    </div>
                </div>

                <div className='contacts-section'>
                    <form onSubmit={handleSubmitNewContact} className='contact-form'>
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

                    <div className='contacts-list'>
                        <h2>Contacts</h2>
                        {contacts.map((contact, index) => (
                            <div key={index} className='contact-item'>
                                <img 
                                    src={contact.image || '/default-avatar.png'} 
                                    alt={contact.name} 
                                />
                                <div className='contact-details'>
                                    <h3>{contact.name}</h3>
                                    <p>{contact.phone}</p>
                                    <p>{contact.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            
                <div className='bottom-navigation'>
                    <i className="bi bi-chat-square-text"></i>
                    <i className="bi bi-people"></i>
                    <i className="bi bi-telephone"></i>
                </div>
            </div>
        </div>
    );
};

export default Contact;
