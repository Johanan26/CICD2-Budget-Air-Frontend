import { useState } from 'react';

export const useFlightSearch = (searchFlights) => {
    const [searchParams, setSearchParams] = useState({
        origin: '',
        destination: ''
    });

    const handleChange = (e) => {
        setSearchParams(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            await searchFlights(searchParams);
        } catch (err) {
            console.error('Error in search:', err);
        }
    };

    return {
        searchParams,
        handleChange,
        handleSearch
    };
};

