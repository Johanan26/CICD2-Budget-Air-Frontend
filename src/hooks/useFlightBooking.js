import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../useTask';

export const useFlightBooking = (bookings, setBookings) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { executeTask } = useTask();

    const bookFlight = async (flight) => {
        if (!user) {
            alert('Please login to book flights');
            navigate('/login');
            return;
        }

        const flightId = flight.flight_id || flight.id;
        const existingBooking = bookings.find(b => 
            (b.flight_id === flightId) && 
            (b.status === 'pending' || b.status === 'paid')
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

            const createdBooking = await executeTask('flight', 'api/bookings', newBooking, 'POST');
            
            if (createdBooking) {
                const updatedBookings = [...bookings, createdBooking];
                setBookings(updatedBookings);
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

