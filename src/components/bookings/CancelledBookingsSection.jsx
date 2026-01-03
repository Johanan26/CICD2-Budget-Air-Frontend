import React from 'react';
import { XCircle } from 'lucide-react';
import BookingCard from './BookingCard';

const CancelledBookingsSection = ({ bookings, getBookingKey }) => {
    if (bookings.length === 0) {
        return null;
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
                <XCircle className="h-5 w-5 mr-2 text-red-500" />
                Cancelled Bookings ({bookings.length})
            </h3>
            <div className="space-y-4">
                {bookings.map((booking) => {
                    const bookingKey = getBookingKey(booking);
                    return (
                        <BookingCard
                            key={bookingKey}
                            booking={booking}
                            bookingKey={bookingKey}
                            variant="cancelled"
                        >
                            <span className="text-red-600 font-semibold">Cancelled</span>
                        </BookingCard>
                    );
                })}
            </div>
        </div>
    );
};

export default CancelledBookingsSection;

