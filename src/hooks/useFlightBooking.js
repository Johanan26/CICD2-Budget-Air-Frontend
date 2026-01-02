import { useNavigate } from 'react-router-dom';
import { useTask } from '../useTask';
import { useAuth } from '../contexts/AuthContext';

export const useFlightBooking = (bookings, setBookings) => {
    const { executeTask } = useTask();
    const { user } = useAuth();
    const navigate = useNavigate();

    const bookFlight = async (flight) => {
        if (!user || !user.user_id) {
            alert('Please login to book flights');
            navigate('/login');
            return;
        }

        const existingBooking = bookings.find(b => 
            (b.flight_id === flight.flight_id || b.flight_id === flight.id) && 
            b.status === 'pending'
        );
        if (existingBooking) {
            alert('This flight is already in your bookings!');
            navigate('/bookings');
            return;
        }

        try {
            const newBooking = {
                user_id: user.user_id,
                flight_id: flight.flight_id || flight.id,
                flight_name: flight.name,
                origin: flight.origin,
                destination: flight.destination,
                departure_time: flight.departure_time,
                arrival_time: flight.arrival_time,
                departure_date: flight.departure_date,
                arrival_date: flight.arrival_date,
                price: flight.price,
                company_id: flight.company_id,
                status: 'pending'
            };

            let bookingResult;
            try {
                bookingResult = await executeTask('user', `api/users/${user.user_id}/bookings`, newBooking, 'POST');
            } catch (userServiceErr) {
                try {
                    bookingResult = await executeTask('user', 'api/bookings', newBooking, 'POST');
                } catch (altErr) {
                    console.error('Error creating booking:', altErr);
                    alert('Failed to create booking. Please try again.');
                    return;
                }
            }

            if (bookingResult) {
                try {
                    const updatedBookings = await executeTask('user', `api/users/${user.user_id}/bookings`, {}, 'GET');
                    if (updatedBookings && Array.isArray(updatedBookings)) {
                        setBookings(updatedBookings);
                    } else {
                        // Try alternative endpoint
                        const altBookings = await executeTask('user', 'api/bookings', { user_id: user.user_id }, 'GET');
                        if (altBookings && Array.isArray(altBookings)) {
                            setBookings(altBookings);
                        }
                    }
                } catch (refreshErr) {
                    console.error('Error refreshing bookings:', refreshErr);
                }
                alert('Flight booked! Go to Bookings to complete payment.');
                navigate('/bookings');
            }
        } catch (err) {
            console.error('Error booking flight:', err);
            alert('Failed to book flight. Please try again.');
        }
    };

    return { bookFlight };
};

