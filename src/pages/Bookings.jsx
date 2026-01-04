import React, { useEffect, useMemo, useState } from 'react';
import { CreditCard, Trash2, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createTask, pollTask } from '../api';

const formatMoney = (n) => {
  if (typeof n === 'string' && n.startsWith('€')) return n;
  const num = Number(n);
  return Number.isFinite(num) ? `€${num.toFixed(2)}` : '€0.00';
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

  const markPaid = (id) => {
    const next = bookings.map((b) =>
      b.id === id ? { ...b, status: 'paid' } : b
    );
    saveBookings(next);
  };

  const deleteBooking = (id) => {
    saveBookings(bookings.filter((b) => b.id !== id));
  };

  const submitPayment = async () => {
    if (!selectedBooking) return;

    try {
      setPaying(true);

      const amount =
        typeof selectedBooking.total_price === 'number'
          ? selectedBooking.total_price
          : Number(String(selectedBooking.total_price ?? selectedBooking.price ?? '').replace(/[^\d.]/g, ''));

      const taskId = await createTask(
        'payment',
        'payments',
        {
          amount,
          currency: 'EUR',
          provider: 'internal',
          description: `Booking ${selectedBooking.id}`,
          reference: String(selectedBooking.id),
        },
        'POST'
      );

      const result = await pollTask(taskId);

      if (!result || result.status !== 'success') {
        throw new Error('Payment failed');
      }

      markPaid(selectedBooking.id);
      setPayModalOpen(false);
    } catch (err) {
      alert('Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (!user) {
    return <p className="p-6">Please log in</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {myBookings.map((b) => (
        <div key={b.id} className="border rounded-lg p-4 mb-3">
          <div className="font-semibold">
            {b.origin} → {b.destination}
          </div>

          <div className="text-sm">
            Total: {formatMoney(b.total_price ?? b.price)}
          </div>

          <div className="mt-2 flex gap-2 items-center">
            {b.status !== 'paid' && (
              <button
                onClick={() => {
                  setSelectedBooking(b);
                  setPayModalOpen(true);
                }}
                className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2"
              >
                <CreditCard size={16} /> Pay
              </button>
            )}

            <button
              onClick={() => deleteBooking(b.id)}
              className="bg-gray-200 px-3 py-2 rounded flex items-center"
            >
              <Trash2 size={16} />
            </button>

            {b.status === 'paid' && (
              <span className="text-green-600 flex items-center gap-2">
                <CheckCircle size={16} /> Paid
              </span>
            )}
          </div>
        </div>
      ))}

      {payModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Enter Card Details</h2>

            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Name on card"
              value={cardForm.name}
              onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
            />
            <input
              className="border p-2 w-full mb-2 rounded"
              placeholder="Card number"
              value={cardForm.number}
              onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
            />
            <div className="flex gap-2">
              <input
                className="border p-2 w-full mb-2 rounded"
                placeholder="MM/YY"
                value={cardForm.expiry}
                onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
              />
              <input
                className="border p-2 w-full mb-2 rounded"
                placeholder="CVC"
                value={cardForm.cvc}
                onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={submitPayment}
                disabled={paying}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                {paying ? 'Paying...' : 'Pay Now'}
              </button>
              <button
                onClick={() => setPayModalOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
