import { useState, useEffect } from 'react';
import { GET, getAuthenticatedHeaders } from '../Fetching/http.fetching';
import ENVIRONMENT from '../enviroment';


const useContact = () => {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            setIsLoading(true);
            try {
                const response = await GET(`${ENVIRONMENT.URL_BACK}/api/contacts`, {
                    headers: getAuthenticatedHeaders(),
                });

                if (response.ok) {
                    const data = await response.json();
                    setContacts(data); 
                } else {
                    throw new Error('Failed to fetch contacts');
                }
            } catch (err) {
                setError(err.message); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts();
    }, []);

    return {
        contacts,
        isLoading,
        error,
        setContacts,
        setError,
        setIsLoading,
    };
};

export default useContact;
