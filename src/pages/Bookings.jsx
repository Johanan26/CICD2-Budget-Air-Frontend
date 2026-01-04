import React, { useEffect, useMemo, useState } from 'react';
import {
  CreditCard,
  Trash2,
  CheckCircle,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createTask, pollTask } from '../api';

const formatMoney = (n) => {
  if (typeof n === 'string' && n.trim().startsWith('€')) return n;
  const num = Number(n);
  if (!Number.isFinite(num)) return '€0.00';
  return `€${num.toFixed(2)}`;
};

const sanitizeDigits = (s) => (s || '').replace(/\D/g, '');

const validateExpiry = (value) => {
  // expects MM/YY
  if (!/^\d{2}\/\d{2}$/.test(value)) return false;
  const [mm, yy] = value.split('/').map(Number);
  if (mm < 1 || mm > 12) return false;

  const now = new Date();
  const curYY = Number(String(now.getFullYear()).slice(-2));
  const curMM = now.getMonth() + 1;

  if (yy < curYY) return false;
  if (yy === curYY && mm < curMM) return false;

  return true;
};

const Bookings = () => {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paying, setPaying] = useState(false);

  const [cardForm, setCardForm] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });
  const [cardErrors, setCardErrors] = useState({});

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

  const deleteBooking = (id) => {
    const next = bookings.filter((b) => b.id !== id);
    saveBookings(next);
  };

  const markPaid = (id) => {
    const next = bookings.map((b) =>
      b.id === id
        ? { ...b, status: 'paid', paid_at: new Date().toISOString() }
        : b
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
    const number = sanitizeDigits(cardForm.number);
    const cvc = sanitizeDigits(cardForm.cvc);

    if (!cardForm.name.trim()) errors.name = 'Name required';
    if (number.length < 13 || number.length > 19)
      errors.number = 'Invalid card number';
    if (!validateExpiry(cardForm.expiry))
      errors.expiry = 'Invalid expiry (MM/YY)';
    if (cvc.length < 3 || cvc.length > 4) errors.cvc = 'Invalid CVC';

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitPayment = async () => {
    if (!selectedBooking) return;
    if (!validateCardForm()) return;

    try {
      setPaying(true);

      const amount =
        typeof selectedBooking.total_price === 'number'
          ? selectedBooking.total_price
          : Number(
              String(selectedBooking.price || '').replace(/[^\d.]/g, '')
            );

      const task = await createTask(
        'payment',
        '/payments',
        {
          user_id: selectedBooking.user_id,
          order_id: selectedBooking.id,
          amount,
          currency: 'EUR',
          provider: 'card',
          description: `BudgetAir booking ${selectedBooking.id}`,
        },
        'POST'
      );

      const result = await pollTask(task.task_id);

      if (result.status !== 'success') {
        throw new Error(result?.error || 'Payment failed');
      }

      markPaid(selectedBooking.id);
      alert('Payment successful!');
      closePayModal();
    } catch (err) {
      console.error(err);
      alert('Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (!user?.user_id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border rounded-xl p-6">
          <AlertTriangle className="text-yellow-600 mb-2" />
          <p>Please log in to view bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {myBookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {myBookings.map((b) => {
            const isPaid = b.status === 'paid';

            return (
              <div
                key={b.id}
                className="bg-white border rounded-xl p-6 flex justify-between gap-4"
              >
                <div>
                  <h2 className="font-semibold text-lg">
                    {b.origin} → {b.destination}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {b.departure_date} • {b.departure_time} → {b.arrival_time}
                  </p>

                  {b.seat_class && (
                    <p className="mt-2 text-sm">
                      Seats:{' '}
                      <strong>
                        {b.seat_class.toUpperCase()} × {b.seat_count}
                      </strong>
                    </p>
                  )}

                  <p className="mt-1">
                    Total:{' '}
                    <strong>
                      {formatMoney(
                        b.total_price !== undefined
                          ? b.total_price
                          : b.price
                      )}
                    </strong>
                  </p>

                  <div className="mt-2">
                    {isPaid ? (
                      <span className="text-green-700 flex items-center gap-1">
                        <CheckCircle size={16} /> Paid
                      </span>
                    ) : (
                      <span className="text-yellow-700 flex items-center gap-1">
                        <AlertTriangle size={16} /> Pending
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  {!isPaid && (
                    <button
                      onClick={() => openPayModal(b)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <CreditCard size={16} /> Pay Now
                    </button>
                  )}

                  <button
                    onClick={() => deleteBooking(b.id)}
                    className="bg-gray-100 px-3 py-2 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {payModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={closePayModal}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            <h2 className="text-lg font-bold mb-4">Card Details</h2>

            <div className="space-y-3">
              <input
                placeholder="Name on card"
                value={cardForm.name}
                onChange={(e) =>
                  setCardForm({ ...cardForm, name: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />
              {cardErrors.name && (
                <p className="text-red-600 text-xs">{cardErrors.name}</p>
              )}

              <input
                placeholder="Card number"
                value={cardForm.number}
                onChange={(e) =>
                  setCardForm({ ...cardForm, number: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />
              {cardErrors.number && (
                <p className="text-red-600 text-xs">{cardErrors.number}</p>
              )}

              <div className="flex gap-2">
                <input
                  placeholder="MM/YY"
                  value={cardForm.expiry}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, expiry: e.target.value })
                  }
                  className="w-1/2 border rounded-lg p-2"
                />
                <input
                  placeholder="CVC"
                  value={cardForm.cvc}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, cvc: e.target.value })
                  }
                  className="w-1/2 border rounded-lg p-2"
                />
              </div>

              {(cardErrors.expiry || cardErrors.cvc) && (
                <p className="text-red-600 text-xs">
                  {cardErrors.expiry || cardErrors.cvc}
                </p>
              )}

              <button
                onClick={submitPayment}
                disabled={paying}
                className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2"
              >
                {paying ? 'Processing...' : 'Confirm Payment'}
              </button>

              <p className="text-xs text-gray-500 mt-2">
                Demo only — card details are not stored.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
