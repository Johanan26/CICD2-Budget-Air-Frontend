import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../useTask';
import { useAuth } from '../contexts/AuthContext';
import { Plane, CreditCard, Calendar, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';

const Bookings = () => {
    const { executeTask, loading, error, result } = useTask();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [payingFor, setPayingFor] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadBookings();
    }, [user, navigate]);

    const loadBookings = () => {
        const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        setBookings(storedBookings);
    };

    const handlePayment = async (booking) => {
        if (!user) {
            alert('Please login to make payments');
            navigate('/login');
            return;
        }

        setPayingFor(booking.id);
        
        try {
            // Convert price string to number (remove € if present)
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
                provider: 'internal'
            };

            const paymentResult = await executeTask('payment', 'payments', paymentData, 'POST');
            
            if (paymentResult) {
                // Update booking status to paid
                const updatedBookings = bookings.map(b => 
                    b.id === booking.id 
                        ? { ...b, status: 'paid', payment_id: paymentResult.id, paid_at: new Date().toISOString() }
                        : b
                );
                localStorage.setItem('bookings', JSON.stringify(updatedBookings));
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

    const handleCancelBooking = (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            const updatedBookings = bookings.map(b => 
                b.id === bookingId 
                    ? { ...b, status: 'cancelled' }
                    : b
            );
            localStorage.setItem('bookings', JSON.stringify(updatedBookings));
            setBookings(updatedBookings);
        }
    };

    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const paidBookings = bookings.filter(b => b.status === 'paid');
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-2">My Bookings</h2>
                <p className="text-gray-600">Manage your flight bookings and payments</p>
            </div>

            {error && (
                <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Pending Bookings */}
            {pendingBookings.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-orange-500" />
                        Pending Payment ({pendingBookings.length})
                    </h3>
                    <div className="space-y-4">
                        {pendingBookings.map((booking) => (
                            <div key={booking.id} className="bg-white p-6 border-2 border-orange-200 rounded-lg shadow-sm">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                    <div className="flex items-center space-x-6 flex-1">
                                        <div className="bg-orange-50 p-3 rounded-full text-orange-600">
                                            <Plane className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{booking.flight_name} <span className="text-gray-400 font-normal text-sm">#{booking.flight_id}</span></h4>
                                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    <span className="font-semibold">{booking.origin}</span>
                                                    <span className="mx-2">→</span>
                                                    <span className="font-semibold">{booking.destination}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {booking.departure_date}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Departure: {booking.departure_time} | Arrival: {booking.arrival_time}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <p className="text-3xl font-extrabold text-orange-600">€{booking.price}</p>
                                        <button
                                            onClick={() => handlePayment(booking)}
                                            disabled={loading && payingFor === booking.id}
                                            className="bg-orange-600 text-white px-6 py-2 rounded text-sm font-bold hover:bg-orange-700 disabled:bg-orange-300 transition-colors"
                                        >
                                            {loading && payingFor === booking.id ? 'Processing...' : 'Pay Now'}
                                        </button>
                                        <button
                                            onClick={() => handleCancelBooking(booking.id)}
                                            className="text-gray-500 text-xs hover:text-red-600"
                                        >
                                            Cancel Booking
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Paid Bookings */}
            {paidBookings.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                        Paid Bookings ({paidBookings.length})
                    </h3>
                    <div className="space-y-4">
                        {paidBookings.map((booking) => (
                            <div key={booking.id} className="bg-white p-6 border-2 border-green-200 rounded-lg shadow-sm">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                    <div className="flex items-center space-x-6 flex-1">
                                        <div className="bg-green-50 p-3 rounded-full text-green-600">
                                            <Plane className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{booking.flight_name} <span className="text-gray-400 font-normal text-sm">#{booking.flight_id}</span></h4>
                                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    <span className="font-semibold">{booking.origin}</span>
                                                    <span className="mx-2">→</span>
                                                    <span className="font-semibold">{booking.destination}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {booking.departure_date}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Departure: {booking.departure_time} | Arrival: {booking.arrival_time}
                                            </p>
                                            {booking.payment_id && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    Payment ID: {booking.payment_id}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-3xl font-extrabold text-green-600">€{booking.price}</p>
                                        <span className="text-xs text-green-600 font-semibold mt-2">✓ Paid</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cancelled Bookings */}
            {cancelledBookings.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <XCircle className="h-5 w-5 mr-2 text-red-500" />
                        Cancelled Bookings ({cancelledBookings.length})
                    </h3>
                    <div className="space-y-4">
                        {cancelledBookings.map((booking) => (
                            <div key={booking.id} className="bg-gray-50 p-6 border border-gray-200 rounded-lg opacity-75">
                                <div className="flex items-center space-x-6">
                                    <div className="bg-gray-200 p-3 rounded-full text-gray-500">
                                        <Plane className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{booking.flight_name} <span className="text-gray-400 font-normal text-sm">#{booking.flight_id}</span></h4>
                                        <p className="text-sm text-gray-500">
                                            {booking.origin} → {booking.destination} | {booking.departure_date}
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className="text-red-600 font-semibold">Cancelled</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Bookings */}
            {bookings.length === 0 && (
                <div className="bg-white p-12 border border-gray-200 rounded-lg shadow-sm text-center">
                    <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Bookings Yet</h3>
                    <p className="text-gray-500 mb-6">Start by searching and booking a flight!</p>
                    <button
                        onClick={() => navigate('/flights')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                    >
                        Browse Flights
                    </button>
                </div>
            )}
        </div>
    );
};

export default Bookings;



