import { useState, useEffect, useCallback } from 'react';

export const useMessage = () => {

    const [message, setMessage] = useState(null);
    
    const [messageType, setMessageType] = useState('info');
    

    const [duration, setDuration] = useState(3000);

    const showMessage = useCallback((text, type = 'info', displayDuration = 3000) => {
        setMessage(text);
        setMessageType(type);
        setDuration(displayDuration);
    }, []);

    const clearMessage = useCallback(() => {
        setMessage(null);
    }, []);

    useEffect(() => {
        let timeoutId;
        
        if (message) {
            timeoutId = setTimeout(() => {
                clearMessage();
            }, duration);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [message, duration, clearMessage]);

    const successMessage = useCallback((text, displayDuration) => {
        showMessage(text, 'success', displayDuration);
    }, [showMessage]);

    const errorMessage = useCallback((text, displayDuration) => {
        showMessage(text, 'error', displayDuration);
    }, [showMessage]);

    const warningMessage = useCallback((text, displayDuration) => {
        showMessage(text, 'warning', displayDuration);
    }, [showMessage]);

    const infoMessage = useCallback((text, displayDuration) => {
        showMessage(text, 'info', displayDuration);
    }, [showMessage]);

    return {
        message,
        messageType,
        showMessage,
        clearMessage,
        successMessage,
        errorMessage,
        warningMessage,
        infoMessage
    };
};

export default useMessage