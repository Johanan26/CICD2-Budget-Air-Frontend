import React from 'react';
import { Plane, MapPin, Clock, Calendar, Euro } from 'lucide-react';

const BookingCard = ({ booking, bookingKey, variant, children }) => {
    const variantStyles = {
        pending: 'border-orange-200 bg-orange-50',
        paid: 'border-green-200 bg-green-50',
        cancelled: 'border-red-200 bg-red-50'
    };

    return (
        <div className={`bg-white border rounded-lg shadow-sm p-6 ${variantStyles[variant] || 'border-gray-200'}`}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{booking.flight_name}</h3>
                    <p className="text-sm text-gray-500">#{booking.flight_id}</p>
                </div>
                <Plane className="h-6 w-6 text-blue-600" />
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-700">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-semibold">{booking.origin}</span>
                    <span className="mx-2">→</span>
                    <span className="font-semibold">{booking.destination}</span>
                </div>

                <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{booking.departure_date}</span>
                </div>

                <div className="flex items-center text-gray-600 text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Departure: {booking.departure_time}</span>
                    <span className="mx-2">•</span>
                    <span>Arrival: {booking.arrival_time}</span>
                </div>

                <div className="flex items-center text-gray-700 font-semibold">
                    <Euro className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{booking.price}</span>
                </div>
            </div>

            {children && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    {children}
                </div>
            )}
        </div>
    );
};

export default BookingCard;

