import { useTask } from '../useTask';
import { useAuth } from '../contexts/AuthContext';

export const useBookingsManagement = (bookings, setBookings) => {
    const { executeTask } = useTask();
    const { user } = useAuth();

    const getBookingKey = (booking) => {
        return `${booking.user_id}-${booking.flight_id}`;
    };

    const handleCancelBooking = async (bookingKey) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        const booking = bookings.find(b => getBookingKey(b) === bookingKey);
        if (!booking || !user) {
            return;
        }

        try {
            const updatedBooking = { ...booking, status: 'cancelled' };
            await executeTask('flight', `api/bookings/${booking.id}`, { status: 'cancelled' }, 'PUT');
            
            const updatedBookings = bookings.map(b => 
                getBookingKey(b) === bookingKey
                    ? updatedBooking
                    : b
            );
            setBookings(updatedBookings);
        } catch (err) {
            console.error('Error cancelling booking:', err);
            alert('Failed to cancel booking. Please try again.');
        }
    };

    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const paidBookings = bookings.filter(b => b.status === 'paid');
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

    return {
        pendingBookings,
        paidBookings,
        cancelledBookings,
        getBookingKey,
        handleCancelBooking
    };
};

