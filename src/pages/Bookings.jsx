import React, { useEffect, useMemo, useState } from 'react';
import { CreditCard, Trash2, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const formatMoney = (n) => {
  if (typeof n === 'string' && n.trim().startsWith('€')) return n;
  const num = Number(n);
  if (!Number.isFinite(num)) return '€0.00';
  return `€${num.toFixed(2)}`;
};

const sanitizeDigits = (s) => (s || '').replace(/\D/g, '');

const validateExpiry = (value) => {
  // expects MM/YY
  const v = (value || '').trim();
  if (!/^\d{2}\/\d{2}$/.test(v)) return false;
  const [mm, yy] = v.split('/').map((x) => Number(x));
  if (!Number.isFinite(mm) || !Number.isFinite(yy)) return false;
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const currentYY = Number(String(now.getFullYear()).slice(-2));
  const currentMM = now.getMonth() + 1;

  if (yy < currentYY) return false;
  if (yy === currentYY && mm < currentMM) return false;

  return true;
};

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cardForm, setCardForm] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });
  const [cardErrors, setCardErrors] = useState({});
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('bookings');
    if (saved) setBookings(JSON.parse(saved));
  }, []);

  const myBookings = useMemo(() => {
    if (!user?.user_id) return [];
    return bookings.filter((b) => b.user_id === user.user_id);
  }, [bookings, user]);

  const saveBookings = (next) => {
    setBookings(next);
    localStorage.setItem('bookings', JSON.stringify(next));
  };

  const deleteBooking = (bookingId) => {
    const next = bookings.filter((b) => b.id !== bookingId);
    saveBookings(next);
  };

  const markPaid = (bookingId) => {
    const next = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'paid', paid_at: new Date().toISOString() } : b
    );
    saveBookings(next);
  };
  const openPayModal = (booking) => {
    setSelectedBooking(booking);
    setCardForm({ name: '', number: '', expiry: '', cvc: '' });
    setCardErrors({});
    setPayModalOpen(true);
  };

  const closePayModal = () => {
    if (paying) return;
    setPayModalOpen(false);
    setSelectedBooking(null);
    setCardErrors({});
  };

  const validateCardForm = () => {
    const errors = {};
    const name = (cardForm.name || '').trim();
    const number = sanitizeDigits(cardForm.number);
    const expiry = (cardForm.expiry || '').trim();
    const cvc = sanitizeDigits(cardForm.cvc);

    if (name.length < 2) errors.name = 'Enter the name on the card';
    if (number.length < 13 || number.length > 19) errors.number = 'Card number must be 13–19 digits';
    if (!validateExpiry(expiry)) errors.expiry = 'Use MM/YY and a valid future date';
    if (cvc.length < 3 || cvc.length > 4) errors.cvc = 'CVC must be 3–4 digits';

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayNow = async (booking) => {
    openPayModal(booking);
  };

  const submitPayment = async () => {
    if (!selectedBooking) return;
    if (!validateCardForm()) return;

    try {
      setPaying(true);
      const amount =
        typeof selectedBooking.total_price === 'number'
          ? selectedBooking.total_price
          : Number(String(selectedBooking.price || '').replace(/[^\d.]/g, '')) || 0;

      if (!amount || amount <= 0) {
        alert('Invalid amount');
        setPaying(false);
        return;
      }
      await api.post('/payments', {
        user_id: selectedBooking.user_id,
        order_id: selectedBooking.id,
        amount,
        currency: 'EUR',
        provider: 'card',
        description: `BudgetAir booking ${selectedBooking.id}`,
      });

      markPaid(selectedBooking.id);
      alert('Payment successful!');
      closePayModal();
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (!user?.user_id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900">Not logged in</h2>
          </div>
          <p className="text-gray-600">Please login to view your bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <div className="text-sm text-gray-600">User ID: {user.user_id}</div>
      </div>

      {myBookings.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-gray-600">You have no bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myBookings.map((b) => {
            const isPaid = b.status === 'paid';
            const seatLine =
              b.seat_class && b.seat_count
                ? `${String(b.seat_class).toUpperCase()} × ${b.seat_count}`
                : null;

            const displayTotal =
              typeof b.total_price === 'number' ? formatMoney(b.total_price) : formatMoney(b.price);

            return (
              <div key={b.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {b.origin} → {b.destination}
                    </div>
                    <div className="text-sm text-gray-600">
                      {b.departure_date} • {b.departure_time} → {b.arrival_time}
                    </div>
                    {seatLine && (
                      <div className="text-sm text-gray-700 mt-2">
                        Seats: <span className="font-semibold">{seatLine}</span>
                      </div>
                    )}

                    <div className="text-sm text-gray-700 mt-1">
                      Total: <span className="font-semibold">{displayTotal}</span>
                    </div>

                    <div className="mt-3">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-semibold">
                          <CheckCircle className="w-4 h-4" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full text-sm font-semibold">
                          <AlertTriangle className="w-4 h-4" /> Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isPaid && (
                      <button
                        onClick={() => handlePayNow(b)}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition"
                        disabled={paying}
                      >
                        <CreditCard className="w-4 h-4" />
                        Pay Now
                      </button>
                    )}

                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-xl transition"
                      disabled={paying}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closePayModal}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Enter card details</h2>
                {selectedBooking && (
                  <p className="text-sm text-gray-600 mt-1">
                    Paying {formatMoney(selectedBooking.total_price ?? selectedBooking.price)}
                  </p>
                )}
              </div>
              <button
                onClick={closePayModal}
                className="p-2 rounded-lg hover:bg-gray-100"
                disabled={paying}
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Name on card
                </label>
                <input
                  value={cardForm.name}
                  onChange={(e) => setCardForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sean Maloney"
                  disabled={paying}
                />
                {cardErrors.name && <p className="text-xs text-red-600 mt-1">{cardErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Card number
                </label>
                <input
                  value={cardForm.number}
                  onChange={(e) => setCardForm((p) => ({ ...p, number: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 5678 9012 3456"
                  disabled={paying}
                />
                {cardErrors.number && <p className="text-xs text-red-600 mt-1">{cardErrors.number}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm((p) => ({ ...p, expiry: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="08/29"
                    disabled={paying}
                  />
                  {cardErrors.expiry && <p className="text-xs text-red-600 mt-1">{cardErrors.expiry}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    value={cardForm.cvc}
                    onChange={(e) => setCardForm((p) => ({ ...p, cvc: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                    disabled={paying}
                  />
                  {cardErrors.cvc && <p className="text-xs text-red-600 mt-1">{cardErrors.cvc}</p>}
                </div>
              </div>

              <button
                onClick={submitPayment}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
                disabled={paying}
              >
                {paying ? 'Processing...' : 'Confirm Payment'}
              </button>

              <p className="text-xs text-gray-500 mt-2">
                Demo note: card details are only validated in the UI and are not sent or stored.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
