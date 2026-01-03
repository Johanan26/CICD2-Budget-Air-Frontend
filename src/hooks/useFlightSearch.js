import { useState, useCallback } from 'react';

export const useFlightSearch = (searchFlights) => {
    const [searchParams, setSearchParams] = useState({
        origin: '',
        destination: '',
        departure_date: ''
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSearch = useCallback(async (e) => {
        e?.preventDefault();
        // Only search if at least one parameter is provided
        if (searchParams.origin || searchParams.destination || searchParams.departure_date) {
            await searchFlights(searchParams);
        } else {
            // If no search params, get all flights
            await searchFlights({});
        }
    }, [searchParams, searchFlights]);

    return { searchParams, handleChange, handleSearch };
};

