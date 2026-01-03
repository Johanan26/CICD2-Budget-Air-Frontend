import React from 'react';
import { Plane, MapPin, Clock, Calendar } from 'lucide-react';
import DataTable from '../shared/DataTable';
import EmptyState from '../shared/EmptyState';
import ActionButtons from '../shared/ActionButtons';

const FlightsTable = ({ flights, isLoading, onEdit, onDelete }) => {
    const columns = ['Flight', 'Route', 'Schedule', 'Price', 'Seats', 'Company', 'Actions'];

    const renderRow = (flight) => (
        <tr key={flight.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div>
                    <div className="text-sm font-medium text-gray-900">{flight.name}</div>
                    <div className="text-sm text-gray-500">#{flight.flight_id}</div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-semibold">{flight.origin}</span>
                    <span className="mx-2">→</span>
                    <span className="font-semibold">{flight.destination}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">
                    <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-gray-400" />
                        <span>{flight.departure_time}</span>
                    </div>
                    <div className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="text-gray-500">{flight.departure_date}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-blue-600">€{flight.price}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">
                    <div className="text-gray-700">Business: <span className="font-semibold">{flight.business_seats || 0}</span></div>
                    <div className="text-gray-700">Economy: <span className="font-semibold">{flight.economy_seats || 0}</span></div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">ID: {flight.company_id}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <ActionButtons
                    onEdit={() => onEdit(flight)}
                    onDelete={() => onDelete(flight.id)}
                />
            </td>
        </tr>
    );

    return (
        <DataTable
            title="All Flights"
            icon={Plane}
            iconColor="blue-600"
            count={flights.length}
            isLoading={isLoading}
            emptyState={<EmptyState icon={Plane} message="No flights found. Create your first flight!" />}
            columns={columns}
            data={flights}
            renderRow={renderRow}
        />
    );
};

export default FlightsTable;

