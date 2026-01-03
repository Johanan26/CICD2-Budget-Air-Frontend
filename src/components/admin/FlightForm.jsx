import React from 'react';
import FormSection from '../shared/FormSection';
import FormField from '../shared/FormField';

const FlightForm = ({ 
    formData, 
    onChange, 
    onSubmit, 
    onCancel, 
    editingFlight, 
    companies, 
    loading 
}) => {
    const companyOptions = companies.map(company => ({
        value: company.company_id,
        label: `${company.name} (${company.code})`
    }));

    return (
        <FormSection
            title={editingFlight ? 'Edit Flight' : 'Create New Flight'}
            onSubmit={onSubmit}
            onCancel={onCancel}
            submitLabel={editingFlight ? 'Update Flight' : 'Create Flight'}
            loading={loading}
            submitButtonColor="blue"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    label="Flight Name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                    placeholder="e.g., Dublin to London"
                />
                <FormField
                    label="Flight ID (F1234567)"
                    name="flight_id"
                    value={formData.flight_id}
                    onChange={onChange}
                    required
                    pattern="F\d{7}"
                    placeholder="F1234567"
                />
                <FormField
                    label="Origin"
                    name="origin"
                    value={formData.origin}
                    onChange={onChange}
                    required
                    placeholder="e.g., DUB"
                />
                <FormField
                    label="Destination"
                    name="destination"
                    value={formData.destination}
                    onChange={onChange}
                    required
                    placeholder="e.g., LHR"
                />
                <FormField
                    label="Departure Time (HH:MM)"
                    name="departure_time"
                    value={formData.departure_time}
                    onChange={onChange}
                    required
                    pattern="\d{2}:\d{2}"
                    placeholder="14:30"
                />
                <FormField
                    label="Arrival Time (HH:MM)"
                    name="arrival_time"
                    value={formData.arrival_time}
                    onChange={onChange}
                    required
                    pattern="\d{2}:\d{2}"
                    placeholder="16:45"
                />
                <FormField
                    label="Departure Date (DD/MM/YYYY)"
                    name="departure_date"
                    value={formData.departure_date}
                    onChange={onChange}
                    required
                    pattern="\d{2}/\d{2}/\d{4}"
                    placeholder="25/12/2024"
                />
                <FormField
                    label="Arrival Date (DD/MM/YYYY)"
                    name="arrival_date"
                    value={formData.arrival_date}
                    onChange={onChange}
                    required
                    pattern="\d{2}/\d{2}/\d{4}"
                    placeholder="25/12/2024"
                />
                <FormField
                    label="Price (€)"
                    name="price"
                    value={formData.price}
                    onChange={onChange}
                    required
                    placeholder="299.99"
                />
                <FormField
                    label="Business Seats"
                    name="business_seats"
                    type="number"
                    value={formData.business_seats}
                    onChange={onChange}
                    required
                    min="0"
                    max="1000"
                    placeholder="0"
                />
                <FormField
                    label="Economy Seats"
                    name="economy_seats"
                    type="number"
                    value={formData.economy_seats}
                    onChange={onChange}
                    required
                    min="0"
                    max="1000"
                    placeholder="0"
                />
                <FormField
                    label="Company"
                    name="company_id"
                    value={formData.company_id}
                    onChange={onChange}
                    required
                    options={companyOptions}
                />
            </div>
        </FormSection>
    );
};

export default FlightForm;

