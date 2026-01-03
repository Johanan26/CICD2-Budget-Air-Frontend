import React, { useState, useEffect } from 'react';
import { useTask } from '../../useTask';
import { Plus, RefreshCw } from 'lucide-react';
import AdminPageHeader from '../shared/AdminPageHeader';
import ErrorMessage from '../shared/ErrorMessage';
import CompanyForm from './CompanyForm';
import CompaniesTable from './CompaniesTable';

const AdminCompanies = () => {
    const { executeTask, loading, error } = useTask();
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        country: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        setIsLoading(true);
        try {
            const companiesResult = await executeTask('flight', 'api/companies', {}, 'GET');
            if (companiesResult && Array.isArray(companiesResult)) {
                setCompanies(companiesResult);
            }
        } catch (err) {
            console.error('Error loading companies:', err);
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

        if (formData.code.length !== 3) {
            alert('Airline code must be exactly 3 characters');
            return;
        }

        try {
            if (editingCompany) {
                await executeTask('flight', `api/companies/${editingCompany.company_id}`, formData, 'PUT');
                alert('Company updated successfully!');
            } else {
                await executeTask('flight', 'api/companies', formData, 'POST');
                alert('Company created successfully!');
            }
            
            resetForm();
            loadCompanies();
        } catch (err) {
            console.error('Error saving company:', err);
            alert('Failed to save company: ' + (err.message || 'Unknown error'));
        }
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setFormData({
            code: company.code,
            name: company.name,
            country: company.country,
            email: company.email,
            phone: company.phone
        });
        setShowForm(true);
    };

    const handleDelete = async (companyId) => {
        if (!window.confirm('Are you sure you want to delete this company? This will also delete all associated flights.')) {
            return;
        }

        try {
            await executeTask('flight', `api/companies/${companyId}`, {}, 'DELETE');
            alert('Company deleted successfully!');
            loadCompanies();
        } catch (err) {
            console.error('Error deleting company:', err);
            alert('Failed to delete company: ' + (err.message || 'Unknown error'));
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            name: '',
            country: '',
            email: '',
            phone: ''
        });
        setEditingCompany(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Airline Companies"
                description="Manage airline companies that operate flights"
            >
                <button
                    onClick={loadCompanies}
                    disabled={isLoading}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-300 transition-colors flex items-center"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    {showForm ? 'Cancel' : 'Add Company'}
                </button>
            </AdminPageHeader>

            <ErrorMessage error={error} />

            {showForm && (
                <CompanyForm
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={resetForm}
                    editingCompany={editingCompany}
                    loading={loading}
                />
            )}

            <CompaniesTable
                companies={companies}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default AdminCompanies;

