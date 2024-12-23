import React from 'react';
import { useParams } from 'react-router-dom';
import MessageChat from './MessageChat';

const MessageRoute = () => {
    const { id } = useParams();
    const currentUser = JSON.parse(sessionStorage.getItem('user')).id;

    return <MessageChat receiverId={id} currentUser={currentUser} />;
};

export default MessageRoute;