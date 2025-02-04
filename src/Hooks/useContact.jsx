import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { createHttpClient } from '../Fetching/http.fetching';
import  { ENVIRONMENT } from '../environment';

const useContact = () => {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const authContext = useAuthContext();
    const { GET, POST } = createHttpClient(authContext);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await GET(`${ENVIRONMENT.URL_BACK}/api/contacts`);

                setContacts(response);
            } catch (error) {
                console.error('Error fetching contacts:', error);
                setError(error.message);
                if (error.message === 'Unauthorized') {
                    authContext.logout();
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts();
    }, [authContext, GET]);

    const addContact = async (contactData) => {
        try {
            const response = await POST(`${ENVIRONMENT.URL_BACK}/api/contacts/add`, contactData);
            setContacts((prevContacts) => [...prevContacts, response.payload]);
        } catch (error) {
            console.error('Error adding contact:', error);
            setError(error.message);
            throw error;
        }
    };

    return {
        contacts,
        setContacts,
        isLoading,
        error,
        addContact,
    };
};

export default useContact;
