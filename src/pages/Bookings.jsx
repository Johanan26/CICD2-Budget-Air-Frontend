import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { useBookingsManagement } from '../hooks/useBookingsManagement';
import { useBookingPayment } from '../hooks/useBookingPayment';
import PendingBookingsSection from '../components/bookings/PendingBookingsSection';
import PaidBookingsSection from '../components/bookings/PaidBookingsSection';
import CancelledBookingsSection from '../components/bookings/CancelledBookingsSection';
import EmptyBookingsState from '../components/bookings/EmptyBookingsState';
import ErrorMessage from '../components/shared/ErrorMessage';

const Bookings = () => {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { bookings, setBookings, loading, error } = useBookings(user);
    const { pendingBookings, paidBookings, cancelledBookings, getBookingKey, handleCancelBooking } = useBookingsManagement(bookings, setBookings);
    const { handlePayment, payingFor, loading: paymentLoading } = useBookingPayment(bookings, setBookings, getBookingKey);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-2">My Bookings</h2>
                <p className="text-gray-600">Manage your flight bookings and payments</p>
            </div>

            {error && <ErrorMessage error={error} />}

            <PendingBookingsSection
                bookings={pendingBookings}
                getBookingKey={getBookingKey}
                handlePayment={handlePayment}
                handleCancelBooking={handleCancelBooking}
                loading={paymentLoading}
                payingFor={payingFor}
            />

            <PaidBookingsSection
                bookings={paidBookings}
                getBookingKey={getBookingKey}
            />

            <CancelledBookingsSection
                bookings={cancelledBookings}
                getBookingKey={getBookingKey}
            />

            {bookings.length === 0 && <EmptyBookingsState />}
        </div>
    );
};

export default Bookings;



