import React from 'react';
import { Building2 } from 'lucide-react';
import DataTable from '../shared/DataTable';
import EmptyState from '../shared/EmptyState';
import ActionButtons from '../shared/ActionButtons';

const CompaniesTable = ({ companies, isLoading, onEdit, onDelete }) => {
    const columns = ['Code', 'Company', 'Country', 'Contact', 'Actions'];

    const renderRow = (company) => (
        <tr key={company.company_id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-green-600">{company.code}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{company.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{company.country}</div>
            </td>
            <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{company.email}</div>
                <div className="text-sm text-gray-500">{company.phone}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <ActionButtons
                    onEdit={() => onEdit(company)}
                    onDelete={() => onDelete(company.company_id)}
                />
            </td>
        </tr>
    );

    return (
        <DataTable
            title="All Companies"
            icon={Building2}
            iconColor="green-600"
            count={companies.length}
            isLoading={isLoading}
            emptyState={<EmptyState icon={Building2} message="No companies found. Create your first company!" />}
            columns={columns}
            data={companies}
            renderRow={renderRow}
        />
    );
};

export default CompaniesTable;

