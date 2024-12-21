import React from 'react'
import './HeaderMessage.css'
import { Link, useParams } from 'react-router-dom'
/* import { DATA_CONTACTOS } from '../../../Data/contactsData' */

const HeaderMessage = ({ contactName }) => {
    const { contact_id } = useParams();
    const contact = DATA_CONTACTOS.find(contact => contact.id.toString() === contact_id);
    return (
        <nav className="header">
            <button className="back"><Link to={'/'}><i className="bi bi-arrow-left"></i></Link></button>
            <span><Link to={'/profile/' + contact.id}><img src={contact.thumbnail} className="profile-image" alt="" /></Link></span>
            <span className='name'>
                {contactName}</span>
            <span className="videocall">
                <i className="bi bi-camera-video"></i>
            </span> 
            <span className="phonecall">
                <i className="bi bi-telephone"></i>
            </span>
            <span className="three-dots">
                <i className="bi bi-three-dots-vertical"></i>
            </span>
        </nav>
    )
}

export default HeaderMessage