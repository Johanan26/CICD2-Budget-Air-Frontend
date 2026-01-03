import { useState, useEffect } from 'react';
import { useTask } from '../useTask';

export const useBookings = (user) => {
    const [bookings, setBookings] = useState([]);
    const { executeTask, loading, error } = useTask();

    useEffect(() => {
        if (!user?.user_id) {
            setBookings([]);
            return;
        }

        const loadBookings = async () => {
            try {
                const fetchedBookings = await executeTask('flight', `api/users/${user.user_id}/bookings`, {}, 'GET');
                setBookings(Array.isArray(fetchedBookings) ? fetchedBookings : []);
            } catch (err) {
                console.error('Error loading bookings:', err);
                setBookings([]);
            }
        };

        loadBookings();
    }, [user?.user_id, executeTask]);

    return { bookings, setBookings, loading, error };
};

