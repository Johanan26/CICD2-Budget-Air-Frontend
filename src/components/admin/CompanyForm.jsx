import React from 'react';
import FormSection from '../shared/FormSection';
import FormField from '../shared/FormField';

const CompanyForm = ({ 
    formData, 
    onChange, 
    onSubmit, 
    onCancel, 
    editingCompany, 
    loading 
}) => {
    return (
        <FormSection
            title={editingCompany ? 'Edit Company' : 'Create New Company'}
            onSubmit={onSubmit}
            onCancel={onCancel}
            submitLabel={editingCompany ? 'Update Company' : 'Create Company'}
            loading={loading}
            submitButtonColor="green"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    label="Airline Code (3 letters)"
                    name="code"
                    value={formData.code}
                    onChange={onChange}
                    required
                    maxLength="3"
                    placeholder="e.g., BAW"
                    style={{ textTransform: 'uppercase' }}
                />
                <FormField
                    label="Company Name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                    placeholder="e.g., British Airways"
                />
                <FormField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={onChange}
                    required
                    placeholder="e.g., United Kingdom"
                />
                <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                    placeholder="contact@airline.com"
                />
                <FormField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    required
                    placeholder="+44 20 1234 5678"
                />
            </div>
        </FormSection>
    );
};

export default CompanyForm;

