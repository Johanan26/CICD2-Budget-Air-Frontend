import { useState, useCallback, useEffect } from 'react';
import { useTask } from '../useTask';

export const useFlights = () => {
    const { executeTask } = useTask();
    const [flights, setFlights] = useState([]);
    const [isLoadingFlights, setIsLoadingFlights] = useState(false);

    const searchFlights = useCallback(async (searchParams = {}) => {
        setIsLoadingFlights(true);
        try {
            const result = await executeTask('flight', '/api/flights', searchParams, 'GET');
            if (result && Array.isArray(result)) {
                setFlights(result);
            } else {
                setFlights([]);
            }
        } catch (err) {
            console.error('Error searching flights:', err);
            setFlights([]);
        } finally {
            setIsLoadingFlights(false);
        }
    }, [executeTask]);

    // Load all flights on mount
    useEffect(() => {
        const loadInitialFlights = async () => {
            setIsLoadingFlights(true);
            try {
                const result = await executeTask('flight', '/api/flights', {}, 'GET');
                if (result && Array.isArray(result)) {
                    setFlights(result);
                } else {
                    setFlights([]);
                }
            } catch (err) {
                console.error('Error loading flights:', err);
                setFlights([]);
            } finally {
                setIsLoadingFlights(false);
            }
        };
        loadInitialFlights();
    }, [executeTask]);

    return { flights, isLoadingFlights, searchFlights };
};

