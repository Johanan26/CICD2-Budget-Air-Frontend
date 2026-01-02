import { useState, useEffect, useCallback } from 'react';
import { useTask } from '../useTask';

export const useBookings = (user) => {
    const { executeTask } = useTask();
    const [bookings, setBookings] = useState([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(false);

    const fetchBookings = useCallback(async () => {
        if (!user || !user.user_id) {
            setBookings([]);
            return;
        }
        
        setIsLoadingBookings(true);
        try {
            const bookingsResult = await executeTask('user', `api/users/${user.user_id}/bookings`, {}, 'GET');
            if (bookingsResult && Array.isArray(bookingsResult)) {
                setBookings(bookingsResult);
            } else {
                try {
                    const altBookingsResult = await executeTask('user', 'api/bookings', { user_id: user.user_id }, 'GET');
                    if (altBookingsResult && Array.isArray(altBookingsResult)) {
                        setBookings(altBookingsResult);
                    }
                } catch (altErr) {
                    console.error('Error fetching bookings from alternative endpoint:', altErr);
                }
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setBookings([]);
        } finally {
            setIsLoadingBookings(false);
        }
    }, [user, executeTask]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return {
        bookings,
        isLoadingBookings,
        fetchBookings,
        setBookings
    };
};

