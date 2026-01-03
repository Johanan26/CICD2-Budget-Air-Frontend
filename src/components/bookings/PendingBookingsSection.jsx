import React from 'react';
import { Clock } from 'lucide-react';
import BookingCard from './BookingCard';

const PendingBookingsSection = ({ bookings, getBookingKey, handlePayment, handleCancelBooking, loading, payingFor }) => {
    if (bookings.length === 0) {
        return null;
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-500" />
                Pending Payment ({bookings.length})
            </h3>
            <div className="space-y-4">
                {bookings.map((booking) => {
                    const bookingKey = getBookingKey(booking);
                    return (
                        <BookingCard
                            key={bookingKey}
                            booking={booking}
                            bookingKey={bookingKey}
                            variant="pending"
                        >
                            <button
                                onClick={() => handlePayment(booking)}
                                disabled={loading && payingFor === bookingKey}
                                className="bg-orange-600 text-white px-6 py-2 rounded text-sm font-bold hover:bg-orange-700 disabled:bg-orange-300 transition-colors"
                            >
                                {loading && payingFor === bookingKey ? 'Processing...' : 'Pay Now'}
                            </button>
                            <button
                                onClick={() => handleCancelBooking(bookingKey)}
                                className="text-gray-500 text-xs hover:text-red-600"
                            >
                                Cancel Booking
                            </button>
                        </BookingCard>
                    );
                })}
            </div>
        </div>
    );
};

export default PendingBookingsSection;

