import React from 'react';
import { Shield, UserCheck, UserX } from 'lucide-react';
import DataTable from '../shared/DataTable';
import LoadingState from '../shared/LoadingState';

const UsersTable = ({ 
    users, 
    isLoading, 
    onRoleChange, 
    updatingUser, 
    loading,
    role,
    icon: Icon,
    iconColor,
    title
}) => {
    const columns = ['User', 'Email', 'Role', 'Actions'];
    
    // Determine color classes based on role
    const bgColorClass = role === 'admin' ? 'bg-purple-100' : 'bg-blue-100';
    const iconTextColorClass = role === 'admin' ? 'text-purple-600' : 'text-blue-600';
    const badgeBgClass = role === 'admin' ? 'bg-purple-100' : 'bg-blue-100';
    const badgeTextClass = role === 'admin' ? 'text-purple-800' : 'text-blue-800';
    const titleColorClass = role === 'admin' ? 'text-purple-600' : 'text-blue-600';

    const renderRow = (user) => (
        <tr key={user.user_id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full ${bgColorClass} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${iconTextColorClass}`} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.firstname} {user.lastname}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeBgClass} ${badgeTextClass}`}>
                    {user.role}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {role === 'admin' ? (
                    <button
                        onClick={() => onRoleChange(user.username, 'regular_user')}
                        disabled={updatingUser === user.username || loading}
                        className="text-orange-600 hover:text-orange-900 disabled:text-gray-400 flex items-center"
                    >
                        <UserX className="h-4 w-4 mr-1" />
                        {updatingUser === user.username ? 'Updating...' : 'Remove Admin'}
                    </button>
                ) : (
                    <button
                        onClick={() => onRoleChange(user.username, 'admin')}
                        disabled={updatingUser === user.username || loading}
                        className="text-green-600 hover:text-green-900 disabled:text-gray-400 flex items-center"
                    >
                        <Shield className="h-4 w-4 mr-1" />
                        {updatingUser === user.username ? 'Updating...' : 'Make Admin'}
                    </button>
                )}
            </td>
        </tr>
    );

    const headerBgColor = role === 'admin' ? 'bg-purple-50' : 'bg-blue-50';

    return (
        <div>
            <h4 className={`text-lg font-bold mb-3 flex items-center ${titleColorClass}`}>
                <Icon className="h-5 w-5 mr-2" />
                {title} ({users.length})
            </h4>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {isLoading ? (
                    <LoadingState message="Loading users..." />
                ) : users.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No {role === 'admin' ? 'administrators' : 'regular users'} found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className={headerBgColor}>
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th 
                                            key={idx}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map(renderRow)}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersTable;

