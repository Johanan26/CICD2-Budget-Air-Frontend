import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../useTask';
import { useAuth } from '../contexts/AuthContext';

export const useBookingPayment = (bookings, setBookings, getBookingKey) => {
    const { executeTask, loading } = useTask();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [payingFor, setPayingFor] = useState(null);

    const handlePayment = async (booking) => {
        if (!user) {
            alert('Please login to make payments');
            navigate('/login');
            return;
        }

        const bookingKey = getBookingKey(booking);
        setPayingFor(bookingKey);
        
        try {
            const priceStr = booking.price.toString().replace('€', '').trim();
            const amount = parseFloat(priceStr);
            
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Invalid flight price');
            }

            const paymentData = {
                amount: amount,
                currency: 'EUR',
                description: `Payment for flight ${booking.flight_name} (${booking.flight_id}) from ${booking.origin} to ${booking.destination}`,
                order_id: booking.flight_id,
                provider: 'internal',
                user_id: user.user_id
            };

            const paymentResult = await executeTask('payment', 'payments', paymentData, 'POST');
            
            if (paymentResult) {
                const updateData = {
                    status: 'paid',
                    payment_id: paymentResult.id,
                    paid_at: new Date().toISOString()
                };
                
                await executeTask('flight', `api/bookings/${booking.id}`, updateData, 'PUT');
                
                const updatedBooking = {
                    ...booking,
                    ...updateData
                };
                
                const updatedBookings = bookings.map(b => 
                    getBookingKey(b) === bookingKey
                        ? updatedBooking
                        : b
                );
                setBookings(updatedBookings);
                alert('Payment successful!');
            }
        } catch (err) {
            console.error('Payment error:', err);
            alert('Payment failed: ' + (err.message || 'Unknown error'));
        } finally {
            setPayingFor(null);
        }
    };

    return {
        handlePayment,
        payingFor,
        loading
    };
};

