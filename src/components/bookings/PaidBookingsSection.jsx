import React from 'react';
import { CheckCircle } from 'lucide-react';
import BookingCard from './BookingCard';

const PaidBookingsSection = ({ bookings, getBookingKey }) => {
    if (bookings.length === 0) {
        return null;
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Paid Bookings ({bookings.length})
            </h3>
            <div className="space-y-4">
                {bookings.map((booking) => {
                    const bookingKey = getBookingKey(booking);
                    return (
                        <BookingCard
                            key={bookingKey}
                            booking={booking}
                            bookingKey={bookingKey}
                            variant="paid"
                        >
                            <span className="text-xs text-green-600 font-semibold mt-2">✓ Paid</span>
                        </BookingCard>
                    );
                })}
            </div>
        </div>
    );
};

export default PaidBookingsSection;

