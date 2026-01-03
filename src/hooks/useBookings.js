import { useState, useEffect } from 'react';

export const useBookings = (user) => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (user && user.user_id) {
            // Load bookings from localStorage as fallback
            const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            setBookings(storedBookings);
        } else {
            setBookings([]);
        }
    }, [user]);

    return { bookings, setBookings };
};

