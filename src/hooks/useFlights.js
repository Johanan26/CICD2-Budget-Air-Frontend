import { useState, useEffect } from 'react';
import { useTask } from '../useTask';

export const useFlights = () => {
    const { executeTask } = useTask();
    const [flights, setFlights] = useState([]);
    const [isLoadingFlights, setIsLoadingFlights] = useState(true);

    useEffect(() => {
        const fetchFlights = async () => {
            setIsLoadingFlights(true);
            try {
                const flightsResult = await executeTask('flight', 'api/flights', {}, 'GET');
                if (flightsResult && Array.isArray(flightsResult)) {
                    setFlights(flightsResult);
                }
            } catch (err) {
                console.error('Error fetching flights:', err);
            } finally {
                setIsLoadingFlights(false);
            }
        };
        fetchFlights();
    }, [executeTask]);

    const searchFlights = async (searchParams) => {
        setIsLoadingFlights(true);
        try {
            const searchResult = await executeTask('flight', 'api/flights/search', searchParams, 'GET');
            if (searchResult && Array.isArray(searchResult)) {
                setFlights(searchResult);
            }
        } catch (err) {
            console.error('Error searching flights:', err);
            throw err;
        } finally {
            setIsLoadingFlights(false);
        }
    };

    return {
        flights,
        isLoadingFlights,
        searchFlights,
        setFlights
    };
};

