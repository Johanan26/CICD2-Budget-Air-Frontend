import { useNavigate } from 'react-router-dom';
import { useTask } from '../useTask';
import { useAuth } from '../contexts/AuthContext';

export const useFlightBooking = (bookings, setBookings) => {
  const { executeTask } = useTask(); // kept for future backend booking calls
  const { user } = useAuth();
  const navigate = useNavigate();

  const bookFlight = async (
    flight,
    selection = { seatClass: 'economy', seatCount: 1, unitPrice: 0, totalPrice: 0 }
  ) => {
    if (!user || !user.user_id) {
      alert('Please login to book flights');
      navigate('/login');
      return;
    }

    const seatClass = selection.seatClass || 'economy';
    const seatCount = Number(selection.seatCount || 1);
    const unitPrice = Number(selection.unitPrice || 0);
    const totalPrice = Number(selection.totalPrice || 0);

    if (!Number.isFinite(seatCount) || seatCount < 1) {
      alert('Please choose how many seats you want');
      return;
    }

    if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
      alert('Invalid price for this flight');
      return;
    }

    try {
      const booking = {
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        user_id: user.user_id,
        flight_id: flight.flight_id,
        origin: flight.origin,
        destination: flight.destination,
        departure_date: flight.departure_date,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        seat_class: seatClass,
        seat_count: seatCount,
        unit_price: unitPrice,
        total_price: totalPrice,
        price: `€${totalPrice.toFixed(2)}`,

        status: 'pending',
        created_at: new Date().toISOString(),
      };

      const updated = [booking, ...(bookings || [])];
      localStorage.setItem('bookings', JSON.stringify(updated));
      setBookings(updated);

      alert('Flight booked! Go to Bookings to complete payment.');
      navigate('/bookings');
    } catch (err) {
      console.error('Error booking flight:', err);
      alert('Failed to book flight. Please try again.');
    }
  };

  return { bookFlight };
};
