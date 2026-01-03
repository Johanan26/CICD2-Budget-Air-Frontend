import React, { useState, useEffect } from 'react';
import { useTask } from '../../useTask';
import { Plus } from 'lucide-react';
import AdminPageHeader from '../shared/AdminPageHeader';
import ErrorMessage from '../shared/ErrorMessage';
import FlightForm from './FlightForm';
import FlightsTable from './FlightsTable';

const AdminFlights = () => {
    const { executeTask, loading, error } = useTask();
    const [flights, setFlights] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingFlight, setEditingFlight] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        flight_id: '',
        origin: '',
        destination: '',
        departure_time: '',
        arrival_time: '',
        departure_date: '',
        arrival_date: '',
        price: '',
        business_seats: 0,
        economy_seats: 0,
        company_id: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [flightsResult, companiesResult] = await Promise.all([
                executeTask('flight', 'api/flights', {}, 'GET'),
                executeTask('flight', 'api/companies', {}, 'GET')
            ]);
            
            if (flightsResult && Array.isArray(flightsResult)) {
                setFlights(flightsResult);
            }
            if (companiesResult && Array.isArray(companiesResult)) {
                setCompanies(companiesResult);
            }
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!/^F\d{7}$/.test(formData.flight_id)) {
            alert('Flight ID must be in format F1234567 (F followed by 7 digits)');
            return;
        }

        if (!/^\d{2}:\d{2}$/.test(formData.departure_time) || !/^\d{2}:\d{2}$/.test(formData.arrival_time)) {
            alert('Time must be in format HH:MM (e.g., 14:30)');
            return;
        }

        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.departure_date) || !/^\d{2}\/\d{2}\/\d{4}$/.test(formData.arrival_date)) {
            alert('Date must be in format DD/MM/YYYY (e.g., 25/12/2024)');
            return;
        }

        try {
            const flightData = {
                ...formData,
                company_id: parseInt(formData.company_id),
                business_seats: parseInt(formData.business_seats) || 0,
                economy_seats: parseInt(formData.economy_seats) || 0
            };

            if (editingFlight) {
                await executeTask('flight', `api/flights/${editingFlight.id}`, flightData, 'PUT');
                alert('Flight updated successfully!');
            } else {
                await executeTask('flight', 'api/flights', flightData, 'POST');
                alert('Flight created successfully!');
            }
            
            resetForm();
            loadData();
        } catch (err) {
            console.error('Error saving flight:', err);
            alert('Failed to save flight: ' + (err.message || 'Unknown error'));
        }
    };

    const handleEdit = (flight) => {
        setEditingFlight(flight);
        setFormData({
            name: flight.name,
            flight_id: flight.flight_id,
            origin: flight.origin,
            destination: flight.destination,
            departure_time: flight.departure_time,
            arrival_time: flight.arrival_time,
            departure_date: flight.departure_date,
            arrival_date: flight.arrival_date,
            price: flight.price,
            business_seats: flight.business_seats || 0,
            economy_seats: flight.economy_seats || 0,
            company_id: flight.company_id.toString()
        });
        setShowForm(true);
    };

    const handleDelete = async (flightId) => {
        if (!window.confirm('Are you sure you want to delete this flight?')) {
            return;
        }

        try {
            await executeTask('flight', `api/flights/${flightId}`, {}, 'DELETE');
            alert('Flight deleted successfully!');
            loadData();
        } catch (err) {
            console.error('Error deleting flight:', err);
            alert('Failed to delete flight: ' + (err.message || 'Unknown error'));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            flight_id: '',
            origin: '',
            destination: '',
            departure_time: '',
            arrival_time: '',
            departure_date: '',
            arrival_date: '',
            price: '',
            business_seats: 0,
            economy_seats: 0,
            company_id: ''
        });
        setEditingFlight(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Flight Management"
                description="Create and manage flights for users to book"
            >
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    {showForm ? 'Cancel' : 'Add Flight'}
                </button>
            </AdminPageHeader>

            <ErrorMessage error={error} />

            {showForm && (
                <FlightForm
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={resetForm}
                    editingFlight={editingFlight}
                    companies={companies}
                    loading={loading}
                />
            )}

            <FlightsTable
                flights={flights}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default AdminFlights;

